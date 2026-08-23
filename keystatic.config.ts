import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'paulchen/paulchen-portfolio',
  },
  collections: {
    // 1. SELECTED PROJECTS
    selectedProjects: collection({
      label: 'Ausgewählte Projekte',
      slugField: 'title',
      path: 'src/content/selected-projects/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Projekt-Titel' } }),
        order: fields.integer({
          label: 'Reihenfolge / Position (1 = ganz oben, 2, 3...)',
          description: 'Bestimmt die Position auf der Startseite und im Stream',
          defaultValue: 1,
        }),
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
        thumbnailMobile: fields.image({ 
          label: 'Mobile Thumbnail (3:4)', 
          description: 'Wird auf Smartphones im 3:4 Format angezeigt',
          directory: 'public/images/thumbnails', 
          publicPath: '/images/thumbnails/' 
        }),
        videoLoop: fields.text({ label: 'Optionaler MP4 Video-Loop URL' }),

        heroDesktop: fields.image({ label: 'Header Bild Desktop (2:1)', directory: 'public/images/content', publicPath: '/images/content/' }),
        heroMobile: fields.image({ label: 'Header Bild Mobile (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
        heroVideoUrl: fields.text({ label: 'Optionaler Header Video URL (MP4)' }),

        blocks: fields.blocks(
          {
            // NEU: INTRO BLOCK (TEXT ZUERST AUF MOBILE)
            introPortraitWithText: {
              label: 'Projekt-Intro: 3:4 Bild + Text (TEXT ZUERST auf Mobile)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Projekt-Intro (Text zuerst auf Mobile)',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name', defaultValue: 'Projekt-Intro' }),
                media: fields.image({ label: 'Bild (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoUrl: fields.text({ label: 'Optionaler Video URL (MP4)' }),
                text: fields.text({ label: 'Intro Beschreibungstext (~Wort~ für Welle, [Text](url) für Link)', multiline: true }),
                textSize: fields.select({
                  label: 'Textgröße',
                  options: [{ label: 'Normal (24px DKT / 20px MBL)', value: 'normal' }, { label: 'Highlight Statement (40px DKT / 30px MBL)', value: 'large' }],
                  defaultValue: 'normal'
                })
              })
            },
            portraitWithText: {
              label: 'Hochformat 3:4 mit Text links (Standard: Bild oben auf Mobile)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Hochformat mit Text',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name (z.B. "Foto Detail")', description: 'Hilft dir beim Sortieren der Blöcke' }),
                media: fields.image({ label: 'Bild (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoUrl: fields.text({ label: 'Optionaler Video URL (MP4)' }),
                text: fields.text({ label: 'Beschreibungstext (~Wort~ für Welle, [Text](url) für Link)', multiline: true }),
                textSize: fields.select({
                  label: 'Textgröße',
                  options: [{ label: 'Normal (24px DKT / 20px MBL)', value: 'normal' }, { label: 'Highlight Statement (40px DKT / 30px MBL)', value: 'large' }],
                  defaultValue: 'normal'
                })
              })
            },
            landscapeStandard: {
              label: 'Querformat Standard (3:2 im Raster)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Querformat Standard (3:2)',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name (z.B. "Foto Serie")', description: 'Hilft dir beim Sortieren der Blöcke' }),
                media: fields.image({ label: 'Bild (3:2)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoUrl: fields.text({ label: 'Optionaler Video URL (MP4)' })
              })
            },
            centeredStatement: {
              label: 'Zentriertes Statement (mit 120px Puffer)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Zentriertes Statement',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name (z.B. "Großes Zitat")', description: 'Hilft dir beim Sortieren der Blöcke' }),
                statement: fields.text({ label: 'Zitat / Statement (~Wort~ für Welle)', multiline: true }),
                textSize: fields.select({
                  label: 'Textgröße',
                  options: [{ label: 'Großes Zitat (40px)', value: 'large' }, { label: 'Normal (24px)', value: 'normal' }],
                  defaultValue: 'large'
                })
              })
            },
            landscapeFullWidth: {
              label: 'Querformat Ganze Breite (3:2 Full Bleed)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Querformat Ganze Breite (Full Bleed)',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name (z.B. "Panorama Foto")', description: 'Hilft dir beim Sortieren der Blöcke' }),
                media: fields.image({ label: 'Bild (3:2)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoUrl: fields.text({ label: 'Optionaler Video URL (MP4)' })
              })
            },
            portraitNoText: {
              label: 'Hochformat 3:4 ohne Text (Rechtsbündig)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Hochformat 3:4 Rechts',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name (z.B. "Detailaufnahme")', description: 'Hilft dir beim Sortieren der Blöcke' }),
                media: fields.image({ label: 'Bild (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoUrl: fields.text({ label: 'Optionaler Video URL (MP4)' }),
                mobileFullWidth: fields.checkbox({ label: 'Auf Mobile über volle Bildschirmbreite', defaultValue: false })
              })
            }
          },
          { label: 'Story Layout Blöcke' }
        )
      }
    }),

    // 2. ARCHIVE
    archive: collection({
      label: 'Archiv Zeilen',
      slugField: 'title',
      path: 'src/content/archive/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Projektname' } }),
        order: fields.integer({
          label: 'Reihenfolge / Position (1 = ganz oben, 2, 3...)',
          description: 'Bestimmt die Position der Zeile im Archiv',
          defaultValue: 1,
        }),
        year: fields.text({ label: 'Jahr (z.B. 2022)' }),
        furtherContext: fields.text({ label: 'Mitwirkende / Details' }),
        infoText: fields.text({ label: 'Info Beschreibung (Pop-up Fenster)', multiline: true }),
        copyright: fields.text({ label: 'Copyright' }),
        gallery: fields.array(
          fields.object({
            mediaFile: fields.image({ label: 'Quadratisches Bild (1:1)', directory: 'public/images/archive', publicPath: '/images/archive/' }),
            videoUrl: fields.text({ label: 'Optionaler MP4 Video URL' }),
            isVideo: fields.checkbox({ label: 'Ist ein Video', defaultValue: false })
          }),
          { label: '1:1 Medien (Bis zu 10)' }
        )
      }
    })
  },

  // 3. SINGLETONS
  singletons: {
    settings: singleton({
      label: 'Navbar & Footer Einstellungen',
      path: 'src/content/singletons/settings',
      format: { data: 'json' },
      schema: {
        brandName: fields.text({ label: 'Logo / Brand Name', defaultValue: 'paulchen.at' }),
        navbarBio: fields.text({ 
          label: 'Fließtext in der Navbar (Nutze ~Wort~ für rote Wellenlinie)', 
          defaultValue: 'paul neuburger’s archive showcases ~conceptual thinking~, driven by a heavy focus on visual solutions and authentic new ways to communicate. Specialising in ~typography~ and spaces loaded with orientation and ~identity~.',
          multiline: true 
        }),
        contactLinkText: fields.text({ label: 'Kontakt-Button Text', defaultValue: 'write me' }),
        contactType: fields.select({
          label: 'Kontakt-Typ',
          options: [
            { label: 'E-Mail (mailto:)', value: 'email' },
            { label: 'Web-Link (URL)', value: 'url' },
            { label: 'Telefon (tel:)', value: 'tel' }
          ],
          defaultValue: 'email'
        }),
        contactTarget: fields.text({ label: 'Kontakt-Ziel', defaultValue: 'hallo@paulchen.at' }),
        moreButtonText: fields.text({ label: 'Menü-Button Text (rechts)', defaultValue: 'mehr' }),
        selectedWorkTitle: fields.text({ label: 'Überschrift Bereich 1', defaultValue: 'Ausgewählte Projekte' }),
        archiveTitle: fields.text({ label: 'Überschrift Bereich 2', defaultValue: 'Archiv' }),
        
        // FOOTER TEXTFELD
        footerText: fields.text({
          label: 'Footer Text (Rechtsbündig über 4 Spalten)',
          description: 'Nutze ~Wort~ für Welle und [Linktext](/url) für Links zu Imprint / Privacy Policy',
          multiline: true,
          defaultValue: 'Your privacy matters to me. When you browse my design work on paulchen.at, your visit remains completely anonymous, ~no cookies~ are stored, tracked, or shared with third parties.\n\nYou can find all legal details regarding my identity in the [Imprint](/imprint) and full information about data handling in the [Privacy Policy](/privacy-policy).\n\nHave a wonderful day!\nBest, Paul'
        }),
      }
    }),

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
    }),

    seo: singleton({
      label: 'SEO, OpenGraph & Favicon',
      path: 'src/content/singletons/seo',
      format: { data: 'json' },
      schema: {
        siteTitle: fields.text({ label: 'Website-Titel (Browsertab)', defaultValue: 'paulchen.at — Creative Direction & Archive' }),
        metaDescription: fields.text({ label: 'Suchmaschinen-Beschreibung', multiline: true, defaultValue: 'Portfolio von Paul Neuburger — Creative Direction, Brand Identity & Typografie.' }),
        ogImage: fields.image({ label: 'OpenGraph Vorschaubild (1200x630px)', directory: 'public/images/seo', publicPath: '/images/seo/' }),
        favicon: fields.image({ label: 'Favicon Icon (32x32px PNG)', directory: 'public/images/seo', publicPath: '/images/seo/' }),
      }
    })
  }
});
