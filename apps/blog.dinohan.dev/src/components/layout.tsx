import * as React from "react"
import { Link } from "gatsby"

const Layout = ({
  location,
  title,
  children,
}: React.PropsWithChildren<{
  location: Location
  title: string
}>) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        <ul>
          <li>
            <a href="mailto:dinohan.dev@gmail.com">dinohan.dev@gmail.com</a>
          </li>
          <li>
            <a href="https://github.com/dinohan" target="_blank" >github.com/dinohan</a>
          </li>
        </ul>
      </footer>
    </div>
  )
}

export default Layout
