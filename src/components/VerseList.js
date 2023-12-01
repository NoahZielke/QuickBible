import Verse from "./Verse";
import { useRef } from "react";
import Button from 'react-bootstrap/Button'

function VerseList( {fullText, bookChapVerse, last} ) {
    const copyRef = useRef(null);

    const handleCopyClick = async () => {
        const textToCopy = copyRef.current.innerText;
        await navigator.clipboard.writeText(textToCopy);
    };

    const renderedVerses = bookChapVerse.map((verseRef) => {
        return (
            <div>
                <Verse fullText={fullText} verseRef={verseRef} />
            </div>
        );
    });

    const passageHeading = getBookChapterVerseHeading(fullText, bookChapVerse);

    if (bookChapVerse[0].book === 100) {
        return;
    } else if (last) { // The only difference between these two is that "last" has no horizontal rule
        return (
            <div>
                <div className="pb-1" ref={copyRef}>
                    {passageHeading}
                    {renderedVerses}
                </div>
                <Button onClick={handleCopyClick} variant="light" size="sm">
                    <div className="copy-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                        </svg>
                        &nbsp;&nbsp;Copy
                    </div>
                </Button>
            </div>
        );
    } else {
        return (
            <div>
                <div className="pb-1" ref={copyRef}>
                    {passageHeading}
                    {renderedVerses}
                </div>
                <Button onClick={handleCopyClick} variant="light" size="sm">
                    <div className="copy-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                        </svg>
                        &nbsp;&nbsp;Copy
                    </div>
                </Button>
                <hr></hr>
            </div>
        );

    }
}

export default VerseList;

function getBookChapterVerseHeading(fullText, bookChapVerse) {
    const book = bookChapVerse[0].book;
    const name = getBookNameFromNumber(book);
    const chapter = bookChapVerse[0].chapter;
    const startVerse = bookChapVerse[0].verse;
    let endVerse = bookChapVerse[bookChapVerse.length - 1].verse
    const chapterEndVerse = getVerseCountForChapter(fullText, book, chapter);

    if (parseInt(startVerse) === 1 && parseInt(endVerse) === chapterEndVerse) {
        return <p className="passage-heading mb-0">{name} {chapter}</p>;
    } else if (parseInt(startVerse) === parseInt(endVerse)) {
        return <p className="passage-heading mb-0">{name} {chapter}:{startVerse}</p>;
    } else {
        return <p className="passage-heading mb-0">{name} {chapter}:{startVerse}-{endVerse}</p>;
    }
}

// This is duplicated in Display.js
function getVerseCountForChapter(fullText, book, chapter) {
    let verseCount = 0;
    if (fullText[book] && fullText[book][chapter]) {
        verseCount = fullText[book][chapter].length;
    } else {
        verseCount = 0;
    };
    return verseCount;
}

function getBookNameFromNumber(number) {
    const bibleBooks = {
        1: 'Genesis',
        2: 'Exodus',
        3: 'Leviticus',
        4: 'Numbers',
        5: 'Deuteronomy',
        6: 'Joshua',
        7: 'Judges',
        8: 'Ruth',
        9: '1 Samuel',
        10: '2 Samuel',
        11: '1 Kings',
        12: '2 Kings',
        13: '1 Chronicles',
        14: '2 Chronicles',
        15: 'Ezra',
        16: 'Nehemiah',
        17: 'Esther',
        18: 'Job',
        19: 'Psalms',
        20: 'Proverbs',
        21: 'Ecclesiastes',
        22: 'Song of Solomon',
        23: 'Isaiah',
        24: 'Jeremiah',
        25: 'Lamentations',
        26: 'Ezekiel',
        27: 'Daniel',
        28: 'Hosea',
        29: 'Joel',
        30: 'Amos',
        31: 'Obadiah',
        32: 'Jonah',
        33: 'Micah',
        34: 'Nahum',
        35: 'Habakkuk',
        36: 'Zephaniah',
        37: 'Haggai',
        38: 'Zechariah',
        39: 'Malachi',
        40: 'Matthew',
        41: 'Mark',
        42: 'Luke',
        43: 'John',
        44: 'Acts',
        45: 'Romans',
        46: '1 Corinthians',
        47: '2 Corinthians',
        48: 'Galatians',
        49: 'Ephesians',
        50: 'Philippians',
        51: 'Colossians',
        52: '1 Thessalonians',
        53: '2 Thessalonians',
        54: '1 Timothy',
        55: '2 Timothy',
        56: 'Titus',
        57: 'Philemon',
        58: 'Hebrews',
        59: 'James',
        60: '1 Peter',
        61: '2 Peter',
        62: '1 John',
        63: '2 John',
        64: '3 John',
        65: 'Jude',
        66: 'Revelation'
    };
    
    return bibleBooks[number];
    
}