const errors = {
  notFound: {
    title: "Page not found",
    description:
      "The page you're looking for doesn't exist or may have been moved.",
    cta: "Back to Home",
  },
  error: {
    title: "Something went wrong",
    description:
      "An unexpected error occurred. Please try again or return to the home page.",
    cta: "Back to Home",
    retry: "Try again",
  },
} as const

export default errors
