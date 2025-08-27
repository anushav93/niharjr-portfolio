import type { StructureBuilder } from 'sanity/structure'

// Define the structure of the Sanity Studio
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Portfolio Management')
    .items([
      // Site Settings (appears first - most important)
      S.listItem()
        .title('⚙️ Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),

      S.divider(), // Visual separator

      // Homepage
      S.listItem()
        .title('🏠 Homepage')
        .id('homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Homepage Content')
        ),

      // About Page
      S.listItem()
        .title('👨‍💼 About Page')
        .id('aboutPage')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
            .title('About Page Content')
        ),

      S.divider(),

      // Quick Access Section
      S.listItem()
        .title('⚡ Quick Actions')
        .id('quickActions')
        .child(
          S.list()
            .title('Quick Actions')
            .items([
              S.listItem()
                .title('✏️ Edit Homepage Hero')
                .id('editHero')
                .child(
                  S.document()
                    .schemaType('homepage')
                    .documentId('homepage')
                    .title('Homepage - Hero Section')
                ),
                
              S.listItem()
                .title('📱 Update Social Media')
                .id('editSocial')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Social Media Links')
                ),

              S.listItem()
                .title('📧 Update Contact Info')
                .id('editContact')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Contact Information')
                ),
            ])
        ),
    ])