export function BibleVerse({ html }: { html: string }) {
  return <div className="scene-bible-verse" dangerouslySetInnerHTML={{ __html: html }} />;
}
