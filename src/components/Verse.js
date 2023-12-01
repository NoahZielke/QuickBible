// verseRefs look like {book: _, chapter:_, verse:_}
function Verse({ fullText, verseRef }) {
    return (
        <div>
            <p className="verse-text my-0">{verseRef.verse} {fullText[verseRef.book][verseRef.chapter][verseRef.verse - 1]}</p>
        </div>
    );
}

export default Verse;