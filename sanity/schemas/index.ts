// Export all schema types
import homepage from './homepage'
import aboutPage from './aboutPage'
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Site-wide settings (appears first in studio)
  siteSettings,
  
  // Page content
  homepage,
  aboutPage,
]
