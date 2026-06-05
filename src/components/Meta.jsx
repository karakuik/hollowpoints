import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'HOLLOWPOINTS.GG'

export default function Meta({ title, description }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  )
}
