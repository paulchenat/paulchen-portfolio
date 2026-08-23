import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'paulchen/paulchen-portfolio',
  },
  collections: {
    // 1. SELECTED PROJECTS (100% ABWÄRTSKOMPATIBEL)
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

        // STARTSEITEN-THUMBNAILS (DESKTOP & MOBILE GETRENNT)
        thumbnailsDesktop: fields.array(
          fields.image({ label: 'Desktop Frame (4:3)', directory: 'public/images/thumbnails', publicPath: '/images/thumbnails/' }),
          { label: '🖥️ Desktop: 1 bis 5 Bilder für Hover-Scrubbing (4:3)', validation: { length: { min: 0, max: 5 } } }
        ),
        videoLoopFile: fields.file({
          label: '🖥️ Desktop: Video-Loop direkt hochladen (MP4 4:3)',
          description: 'Optional: Spielt auf Desktop als Video-Autoplay-Loop statt Bildern',
          directory: 'public/videos',
          publicPath: '/videos/',
        }),
        thumbnailMobile: fields.image({ 
          label: '📱 Mobile: Bild-Thumbnail (3:4)', 
          description: 'Wird auf Smartphones im 3:4 Format angezeigt',
          directory: 'public/images/thumbnails', 
          publicPath: '/images/thumbnails/' 
        }),
        mobileVideoLoop: fields.file({
          label: '📱 Mobile: Video-Loop direkt hochladen (MP4 3:4)',
          description: 'Optional: Eigenes Hochformat-Video für Smartphones',
          directory: 'public/videos',
          publicPath: '/videos/',
        }),
        videoLoop: fields.text({ label: 'Oder: Externer MP4 Video-Loop URL' }),

        // PROJEKT HEADER-MEDIEN (DESKTOP & MOBILE GETRENNT)
        heroDesktop: fields.image({ 
          label: '🖥️ Desktop: Header-Bild (2:1)', 
          directory: 'public/images/content', 
          publicPath: '/images/content/' 
        }),
        heroVideoFile: fields.file({
          label: '🖥️ Desktop: Header-Video direkt hochladen (MP4 2:1)',
          description: 'Querformat-Video für Desktop-Bildschirme',
          directory: 'public/videos',
          publicPath: '/videos/',
        }),
        heroMobile: fields.image({ 
          label: '📱 Mobile: Header-Bild (3:4)', 
          directory: 'public/images/content', 
          publicPath: '/images/content/' 
        }),
        heroMobileVideoFile: fields.file({
          label: '📱 Mobile: Header-Video direkt hochladen (MP4 3:4)',
          description: 'Eigenes Hochformat-Video für Smartphones',
          directory: 'public/videos',
          publicPath: '/videos/',
        }),
        heroVideoUrl: fields.text({ label: 'Oder: Externer Header Video URL (MP4)' }),
        heroVideoHasAudio: fields.checkbox({ 
          label: '🔊 Header-Video hat Ton (Zeigt "Ton an"-Button)', 
          defaultValue: false 
        }),

        // MODULARE BLÖCKE
        blocks: fields.blocks(
          {
            introPortraitWithText: {
              label: 'Projekt-Intro: 3:4 Bild + Text (TEXT ZUERST auf Mobile)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Projekt-Intro (Text zuerst auf Mobile)',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name', defaultValue: 'Projekt-Intro' }),
                media: fields.image({ label: 'Bild (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoFile: fields.file({ label: 'Oder: Video direkt hochladen (MP4)', directory: 'public/videos', publicPath: '/videos/' }),
                hasAudio: fields.checkbox({ label: 'Video hat Ton (Zeigt "Ton an"-Button)', defaultValue: false }),
                text: fields.text({ label: 'Intro Beschreibungstext (~Wort~ für Welle, [Text](url) für Link)', multiline: true }),
                textSize: fields.select({
                  label: 'Textgröße',
                  options: [{ label: 'Normal (24px DKT / 20px MBL)', value: 'normal' }, { label: 'Highlight Statement (40px DKT / 30px MBL)', value: 'large' }],
                  defaultValue: 'normal'
                })
              })
            },
            portraitWithText: {
              label: 'Hochformat 3:4 mit Text links',
              itemLabel: (props) => props.fields.adminLabel.value || 'Hochformat mit Text',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name', defaultValue: 'Hochformat mit Text' }),
                media: fields.image({ label: 'Bild (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoFile: fields.file({ label: 'Oder: Video direkt hochladen (MP4)', directory: 'public/videos', publicPath: '/videos/' }),
                hasAudio: fields.checkbox({ label: 'Video hat Ton (Zeigt "Ton an"-Button)', defaultValue: false }),
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
                adminLabel: fields.text({ label: 'Interner Block-Name', defaultValue: 'Querformat Standard' }),
                media: fields.image({ label: 'Bild (3:2)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoFile: fields.file({ label: 'Oder: Video direkt hochladen (MP4)', directory: 'public/videos', publicPath: '/videos/' }),
                hasAudio: fields.checkbox({ label: 'Video hat Ton (Zeigt "Ton an"-Button)', defaultValue: false })
              })
            },
            centeredStatement: {
              label: 'Zentriertes Statement (mit 120px Puffer)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Zentriertes Statement',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name', defaultValue: 'Großes Zitat' }),
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
                adminLabel: fields.text({ label: 'Interner Block-Name', defaultValue: 'Querformat Full Bleed' }),
                media: fields.image({ label: 'Bild (3:2)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoFile: fields.file({ label: 'Oder: Video direkt hochladen (MP4)', directory: 'public/videos', publicPath: '/videos/' }),
                hasAudio: fields.checkbox({ label: 'Video hat Ton (Zeigt "Ton an"-Button)', defaultValue: false })
              })
            },
            portraitNoText: {
              label: 'Hochformat 3:4 ohne Text (Rechtsbündig)',
              itemLabel: (props) => props.fields.adminLabel.value || 'Hochformat 3:4 Rechts',
              schema: fields.object({
                adminLabel: fields.text({ label: 'Interner Block-Name', defaultValue: 'Detailaufnahme' }),
                media: fields.image({ label: 'Bild (3:4)', directory: 'public/images/content', publicPath: '/images/content/' }),
                videoFile: fields.file({ label: 'Oder: Video direkt hochladen (MP4)', directory: 'public/videos', publicPath: '/videos/' }),
                hasAudio: fields.checkbox({ label: 'Video hat Ton (Zeigt "Ton an"-Button)', defaultValue: false }),
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
        furtherContext: fields.text({ label: 'Mitwirkende / Details', multiline: true }),
        infoText: fields.text({ label: 'Info Beschreibung (Pop-up Fenster)', multiline: true }),
        copyright: fields.text({ label: 'Copyright' }),
        gallery: fields.array(
          fields.object({
            mediaFile: fields.image({ label: 'Quadratisches Bild (1:1 JPG/PNG/GIF)', directory: 'public/images/archive', publicPath: '/images/archive/' }),
            videoFile: fields.file({ label: 'Oder: 1:1 Video direkt hochladen (MP4)', directory: 'public/videos', publicPath: '/videos/' }),
            hasAudio: fields.checkbox({ label: 'Video hat Ton', defaultValue: false }),
            isVideo: fields.checkbox({ label: 'Ist ein Video (zeigt Video-Badge)', defaultValue: false })
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
        footerText: fields.text({
          label: 'Footer Text (Rechtsbündig über 4 Spalten)',
          description: 'Nutze ~Wort~ für Welle. Exakte Links so einfügen: [Imprint](/imprint) und [Privacy Policy](/privacy-policy)',
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

    imprint: singleton({
      label: 'Seite: Impressum',
      path: 'src/content/singletons/imprint',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Überschrift', defaultValue: 'Imprint' }),
        content: fields.text({ label: 'Impressum Inhalt', multiline: true })
      }
    }),

    privacyPolicy: singleton({
      label: 'Seite: Privacy Policy (Datenschutz)',
      path: 'src/content/singletons/privacyPolicy',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'Überschrift', defaultValue: 'Privacy Policy' }),
        intro: fields.text({ label: 'Intro Text (größer)', multiline: true }),
        content: fields.text({ label: 'Datenschutzerklärung Inhalt', multiline: true })
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
