import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'paulchen/paulchen-portfolio',
  },
  collections: {
    selectedProjects: collection({
      label: 'Ausgewählte Projekte',
      slugField: 'title',
      path: 'src/content/selected-projects/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Projekt-Titel' } }),
        year: fields.text({ label: 'Jahr (z.B. 2024)' }),
        location: fields.text({ label: 'Ort (z.B. Wien)' }),
        furtherContext: fields.text({ label: 'Zusatztext / Disziplinen (max. 3 Zeilen)', multiline: true }),
        copyright: fields.text({ label: 'Copyright (z.B. © Gruppe am Park)' }),
        theme: fields.object({
          backgroundColor: fields.text({ label: 'Hintergrundfarbe (HEX)', defaultValue: '#ffffff' }),
          textColor: fields.text({ label: 'Textfarbe (HEX)', defaultValue: '#000000' }),
          wavyColor: fields.text({ label: 'Wellenlinien-Farbe (HEX)', defaultValue: '#ff0000' }),
          isDarkTheme: fields.checkbox({ label: 'Dark Mode Modus (Schwarzer Hintergrund / Weiße Welle)', defaultValue: false })
        }, { label: 'Projekt Farbschema (Theming)' }),
        thumbnailsDesktop: fields.array(
          fields.image({ label: 'Desktop Frame (4:3)', directory: 'public/images/thumbnails', publicPath: '/images/thumbnails/' }),
          { label: 'Desktop Hover-Scrubbing Thumbnails (1 bis 5 Bilder)', validation: { length: { min: 1, max: 5 } } }
        ),
        thumbnailMobile: fields.image({ label: 'Mobile Thumbnail (3:4)', directory: 'public/images/thumbnails', publicPath: '/images/thumbnails/' }),
        videoLoop: fields.text({ label: 'Optionaler MP4 Loop URL' }),
        heroDesktop: fields.image({ label: 'Header Bild Desktop (2:1)', directory: 'public/images/content', publicPath: '/images/content/' }),
        heroMobile: fields.image({ label: 'Header Bild Mobile (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
        blocks: fields.blocks(
          {
            portraitWithText: {
              label: 'Hochformat 3:4 mit Text links',
              schema: fields.object({
                media: fields.image({ label: 'Bild (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
                text: fields.text({ label: 'Beschreibungstext', multiline: true }),
                textSize: fields.select({
                  label: 'Textgröße',
                  options: [{ label: 'Normal (24px DKT / 20px MBL)', value: 'normal' }, { label: 'Highlight Statement (40px DKT / 30px MBL)', value: 'large' }],
                  defaultValue: 'normal'
                })
              })
            },
            landscapeStandard: {
              label: 'Querformat Standard (3:2)',
              schema: fields.object({ media: fields.image({ label: 'Bild (3:2)', directory: 'public/images/content', publicPath: '/images/content/' }) })
            },
            centeredStatement: {
              label: 'Zentriertes Statement',
              schema: fields.object({
                statement: fields.text({ label: 'Zitat / Statement', multiline: true }),
                textSize: fields.select({
                  label: 'Textgröße',
                  options: [{ label: 'Großes Zitat (40px)', value: 'large' }, { label: 'Normal (24px)', value: 'normal' }],
                  defaultValue: 'large'
                })
              })
            },
            landscapeFullWidth: {
              label: 'Querformat Ganze Breite (3:2 Full Bleed)',
              schema: fields.object({ media: fields.image({ label: 'Bild (3:2)', directory: 'public/images/content', publicPath: '/images/content/' }) })
            },
            portraitNoText: {
              label: 'Hochformat 3:4 ohne Text',
              schema: fields.object({
                media: fields.image({ label: 'Bild (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
                mobileFullWidth: fields.checkbox({ label: 'Auf Mobile über volle Bildschirmbreite', defaultValue: false })
              })
            }
          },
          { label: 'Story Layout Blöcke' }
        )
      }
    }),
    archive: collection({
      label: 'Archiv Zeilen',
      slugField: 'title',
      path: 'src/content/archive/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Projektname' } }),
        year: fields.text({ label: 'Jahr (z.B. 2022)' }),
        furtherContext: fields.text({ label: 'Mitwirkende / Details' }),
        infoText: fields.text({ label: 'Info Beschreibung', multiline: true }),
        copyright: fields.text({ label: 'Copyright' }),
        gallery: fields.array(
          fields.object({
            mediaFile: fields.image({ label: 'Quadratisches Bild (1:1)', directory: 'public/images/archive', publicPath: '/images/archive/' }),
            isVideo: fields.checkbox({ label: 'Ist ein Video', defaultValue: false })
          }),
          { label: '1:1 Medien' }
        )
      }
    })
  },
  singletons: {
    about: singleton({
      label: 'Seite: Über mich',
      path: 'src/content/singletons/about',
      format: { data: 'json' },
      schema: {
        headline: fields.text({ label: 'Hauptaussage / Intro', multiline: true }),
        bio: fields.text({ label: 'Ausführliche Biografie', multiline: true }),
        clients: fields.text({ label: 'Kundenliste & Agenturen', multiline: true }),
        awards: fields.text({ label: 'Auszeichnungen & Presse', multiline: true }),
      }
    })
  }
});
