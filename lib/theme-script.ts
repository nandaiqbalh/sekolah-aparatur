import { THEME_COOKIE_NAME, type Theme } from "@/lib/theme-cookie"

export function getThemeInitScript(
  cookieName = THEME_COOKIE_NAME,
  defaultTheme: Theme = "light"
) {
  return `(function(){try{var d=document.documentElement,n="${cookieName}",m=document.cookie.match(new RegExp("(?:^|; )"+n+"=([^;]*)")),c=m?m[1]:"${defaultTheme}",t=c==="dark"?"dark":"light";if(t==="dark")d.classList.add("dark");else d.classList.remove("dark");d.style.colorScheme=t}catch(e){}})();`
}
