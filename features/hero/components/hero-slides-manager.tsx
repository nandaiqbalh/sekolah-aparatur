"use client"

import { GripVertical, Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { usePermissions } from "@/components/admin/admin-permissions-provider"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import {
  AdminTableCard,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "@/components/admin/admin-table-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import {
  deleteHeroSlideAction,
  listHeroSlidesAction,
  reorderHeroSlidesAction,
} from "@/features/hero/actions/hero-slide-actions"
import type { HeroSlideDto } from "@/features/hero/schemas/hero-slide"
import { useDictionary } from "@/lib/i18n/dictionary-provider"
import { toastError, toastSuccess } from "@/lib/notification"
import { ADMIN_ROUTES, adminHeroPath } from "@/lib/routes"

export function HeroSlidesManager({ initialSlides }: { initialSlides: HeroSlideDto[] }) {
  const dict = useDictionary()
  const copy = dict.admin.hero
  const { can } = usePermissions()
  const [slides, setSlides] = useState(initialSlides)
  const [deleteTarget, setDeleteTarget] = useState<HeroSlideDto | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [reordering, setReordering] = useState(false)

  async function refresh() {
    const result = await listHeroSlidesAction()
    if (result.ok && result.data) setSlides(result.data)
  }

  const canReorder = can("hero.update") && !reordering

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return
    const previous = slides
    const reordered = [...slides]
    const [moved] = reordered.splice(fromIndex, 1)
    if (!moved) return
    reordered.splice(toIndex, 0, moved)
    const items = reordered.map((item, index) => ({ id: item.id, sortOrder: index }))
    setSlides(reordered.map((item, index) => ({ ...item, sortOrder: index })))
    setReordering(true)
    const result = await reorderHeroSlidesAction({ items })
    setReordering(false)
    if (result.ok) {
      toastSuccess(copy.reordered, dict.common.toastSavedDesc)
      return
    }
    setSlides(previous)
    toastError(dict.common.toastErrorTitle, result.message || dict.common.toastTryAgainDesc)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const result = await deleteHeroSlideAction({ id: deleteTarget.id })
    if (result.ok) {
      toastSuccess(copy.deleted, dict.common.toastDeletedDesc)
      setDeleteTarget(null)
      await refresh()
      return
    }
    toastError(dict.common.toastErrorTitle, result.message || dict.common.toastTryAgainDesc)
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={copy.title}
        description={copy.description}
        actions={
          can("hero.create") ? (
            <Button nativeButton={false} render={<Link href={ADMIN_ROUTES.heroNew} />} className="cursor-pointer">
              <Plus className="mr-1 size-4" />
              {copy.create}
            </Button>
          ) : null
        }
      />

      {slides.length === 0 ? (
        <EmptyState icon={ImageIcon} title={copy.empty} description={copy.createDescription} />
      ) : (
        <AdminTableCard>
          <AdminTableHead>
            <AdminTableRow>
              {can("hero.update") ? <AdminTableHeaderCell className="w-10" /> : null}
              <AdminTableHeaderCell>{copy.columnImage}</AdminTableHeaderCell>
              <AdminTableHeaderCell>{copy.columnAlt}</AdminTableHeaderCell>
              <AdminTableHeaderCell>{copy.columnStatus}</AdminTableHeaderCell>
              <AdminTableHeaderCell align="right">{dict.admin.actions}</AdminTableHeaderCell>
            </AdminTableRow>
          </AdminTableHead>
          <tbody>
            {slides.map((slide, index) => (
              <AdminTableRow
                key={slide.id}
                draggable={canReorder}
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => {
                  if (!canReorder) return
                  event.preventDefault()
                }}
                onDrop={() => {
                  if (dragIndex === null) return
                  void handleReorder(dragIndex, index)
                  setDragIndex(null)
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`hover:bg-muted/30 ${dragIndex === index ? "opacity-50" : ""} ${canReorder ? "cursor-grab active:cursor-grabbing" : ""}`}
              >
                {can("hero.update") ? (
                  <AdminTableCell className="w-10 text-muted-foreground">
                    <GripVertical className="size-4" aria-label={copy.dragHandle} />
                  </AdminTableCell>
                ) : null}
                <AdminTableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt=""
                    draggable={false}
                    className="h-14 w-24 rounded-md object-cover"
                  />
                </AdminTableCell>
                <AdminTableCell className="max-w-sm text-muted-foreground">
                  <span className="line-clamp-2">{slide.alt}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <AdminStatusBadge
                    isActive={slide.isPublished}
                    activeLabel={copy.statusPublished}
                    inactiveLabel={copy.statusHidden}
                  />
                </AdminTableCell>
                <AdminTableCell align="right">
                  <div className="flex justify-end gap-1" onDragStart={(event) => event.stopPropagation()}>
                    {can("hero.update") ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        nativeButton={false}
                        render={<Link href={adminHeroPath(slide.id)} />}
                        aria-label={copy.edit}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    ) : null}
                    {can("hero.delete") ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => setDeleteTarget(slide)}
                        aria-label={dict.admin.delete}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTableCard>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        type="warning"
        title={copy.deleteTitle}
        message={copy.deleteMessage}
        confirmLabel={dict.admin.delete}
        cancelLabel={dict.admin.cancel}
        showCancel
        onConfirm={handleDelete}
      />
    </div>
  )
}
