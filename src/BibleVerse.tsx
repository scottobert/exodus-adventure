import { useState } from 'react';

interface BibleVerseProps {
  html: string;
  chapterData?: any; // The full chapter JSON as returned from the API
}

export function BibleVerse({ html, chapterData }: BibleVerseProps) {
  const [open, setOpen] = useState(false);

  // Extract chapter and book from the HTML string for the modal title
  const match = html.match(/Exodus (\d+):/);
  const chapter = match ? match[1] : null;

  // Render all verses from chapterData
  let fullChapter = null;
  if (chapterData && chapterData.chapter && Array.isArray(chapterData.chapter.content)) {
    fullChapter = (
      <div className="bible-chapter-modal-content">
        {chapterData.chapter.content.map((v: any) => (
          <div key={v.number} className="bible-chapter-verse">
            <span className="bible-chapter-verse-number">{v.number}</span>{' '}
            {v.content.map((t: any) => (typeof t === 'string' ? t : ''))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="scene-bible-verse">
      <span dangerouslySetInnerHTML={{ __html: html }} />
      {chapterData && (
        <>
          {' '}
          <button
            className="bible-chapter-link"
            onClick={() => setOpen(true)}
            style={{ marginLeft: 8 }}
          >
            Read whole chapter
          </button>
          {open && (
            <div className="bible-chapter-modal-overlay" onClick={() => setOpen(false)}>
              <div className="bible-chapter-modal" onClick={e => e.stopPropagation()}>
                <div className="bible-chapter-modal-header">
                  <span>Exodus {chapter}</span>
                  <button className="bible-chapter-modal-close" onClick={() => setOpen(false)}>&times;</button>
                </div>
                <div className="bible-chapter-modal-body">
                  {fullChapter}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
