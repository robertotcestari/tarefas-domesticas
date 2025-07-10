import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  // Páginas públicas (login, erro)
  const publicPages = ["/auth/signin", "/auth/error"]
  const isPublicPage = publicPages.includes(nextUrl.pathname)
  
  // Se não está logado e tenta acessar página privada
  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl))
  }
  
  // Se está logado e tenta acessar página de login
  if (isLoggedIn && nextUrl.pathname === "/auth/signin") {
    return NextResponse.redirect(new URL("/", nextUrl))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
