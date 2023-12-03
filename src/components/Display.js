import VerseList from "./VerseList";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import KJVFullText from "../resources/KJVFullText";

function Display( {versionList} ) {
    const [version, setVersion] = useState(KJVFullText);

    const [bookChapVerse, setBookChapVerse] = useState([
        [{book: 43, chapter: 3, verse: 16}],
        [{book: 49, chapter: 2, verse: 8}, {book: 49, chapter: 2, verse: 9}],
        [{book: 45, chapter: 4, verse: 5}],
        [{book: 56, chapter: 3, verse: 5}],
        [{book: 45, chapter: 3, verse: 24}],
        [{book: 43, chapter: 6, verse: 47}],
    ]);

    const [resultsFeedback, setResultsFeedback] = useState({search: "", results: -1});

    const [searchQuery, setSearchQuery] = useState("");

    const handleVersionSelect = (event) => {
        versionList.map((singleVersion) => {
            if (singleVersion[0] === event) {
                setVersion(singleVersion);
            }
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const normalized = normalizeQuery(version[1], searchQuery, setResultsFeedback);
        setBookChapVerse(normalized);
        setSearchQuery("");
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const renderedVerseLists = bookChapVerse.map((singleResult) => {
        if (singleResult === bookChapVerse[bookChapVerse.length - 1]) {
            return (
                <div>
                    <VerseList fullText={version[1]} bookChapVerse={singleResult} last={true}/>
                </div>
            );
        } else {
            return (
                <div>
                    <VerseList fullText={version[1]} bookChapVerse={singleResult} last={false}/>
                </div>
            );
        }
    });

    // Codes:
    // -1 -> Hide results (startup)
    // -2 -> Blocks empty searches, or searches less than 2 chars
    // -3 -> For verse ref searches. Display search only, not result #
    // -4 -> For term searches that return over 1000 results
    //  0 -> No results
    function renderResultsFeedback() {
        if (resultsFeedback.results === -1) {
            return <div className="general-text pb-4 ps-2"></div>;
        } else if (resultsFeedback.results === -2) {
            return <div className="general-text pb-4 ps-2">Search "{resultsFeedback.search}" was not longer than 2 characters</div>;
        } else if (resultsFeedback.results === -3) {
            return <div className="general-text pb-4 ps-2">You searched for "{resultsFeedback.search}"</div>;
        } else if (resultsFeedback.results === -4) {
            return <div className="general-text pb-4 ps-2">1000 results (truncated) for "{resultsFeedback.search}"</div>;
        } else if (resultsFeedback.results === 0) {
            return <div className="general-text pb-4 ps-2">No results for "{resultsFeedback.search}"</div>;
        } else {
            return <div className="general-text pb-4 ps-2">{resultsFeedback.results} results for "{resultsFeedback.search}"</div>;
        }
    };

    const renderedResultsFeedback = renderResultsFeedback();


    return (
        <div>
            <div className="row justify-content-center pb-2">
                <div className="col-lg-6 col-sm-12">
                    <div className="row text-end">
                        <div className="col-lg-12">
                        <Dropdown className="version-menu my-0" onSelect={handleVersionSelect}>
                            <Dropdown.Toggle variant="light"> {/* variant="nonsense"*/}
                                {version[0]}&nbsp;
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="KJV">King James Version (KJV)</Dropdown.Item>
                                <Dropdown.Item eventKey="WEB">World English Bible (WEB)</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-6 col-sm-12 pb-4">
                    <Form className="search-bar" onSubmit={handleSubmit}>
                        <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Enter passage or search term"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <Button variant="primary" type="submit" onClick={handleSubmit}>
                            &nbsp;&nbsp;&nbsp;
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                            &nbsp;&nbsp;&nbsp;
                        </Button>
                        </InputGroup>
                    </Form>
                    <div className="pt-2">
                        {renderedResultsFeedback}
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-6 col-sm-12">
                    {renderedVerseLists}
                </div>
            </div>

            <div className="py-5"></div>
            <footer className="general-text pt-5 pb-2">
                <hr></hr>
                {/* Copyright disclaimer for a version, if there is one */}
                <a href="./about.html" target="_blank" className="footer-link">About this App & Search Tips</a>
            </footer>
        </div>
    );
}

export default Display;

// This is duplicated in VerseList.js
function getVerseCountForChapter(fullText, book, chapter) {
    let verseCount = 0;
    if (fullText[book] && fullText[book][chapter]) {
        verseCount = fullText[book][chapter].length;
    } else {
        verseCount = 0;
    };
    return verseCount;
}

// Takes a [{book, chapters: [startChapter, endChapter], verses: [startVerse, endVerse]}, ...], and returns a [[{verseRef}, {verseRef}, ...], ...]
//
// First creates a range for each term. Example:
//
// Matthew 1:23-25, 2:23-4:12
// [{book: 40, chapters: ['1', '1'], verses ['23', '25']}, {book: 40, chapters: ['2', '4'], verses ['23', '12']}]

// [
// 	{book: 40, ranges: [
// 		{chapter: 1, startVerse: 23, endVerse: 25}
// 		]
// 	}, 
// 	{book: 40, ranges: [
// 		{chapter: 2, startVerse: 23, endVerse: (end2)},
// 		{chapter: 3, startVerse: 1, endVerse: (end3)}, 
// 		{chapter: 4, startVerse: 1, endVerse: 12}
// 		]
// 	}
// ]
function getVerseRefs(fullText, filteredSearchTerms) {

    const results = filteredSearchTerms.map((term) => {
        // For each term, we need a [{book, ranges: [{chapter, startVerse, endVerse}, ...] }]
        const startChapter = term.chapters[0];
        const endChapter = term.chapters[1];
        const startVerse = term.verses[0];
        const endVerse = term.verses[1];

        if (startChapter === endChapter) {
            return [{book: term.book, ranges: [{chapter: startChapter, startVerse: startVerse, endVerse: endVerse}]}];
        } else {
            // Fill all chapters involved, then edit first and last's startVerse/endVerse respectively
            let chapterRange = [];
            for (let i = startChapter; i <= endChapter; i++) {
                chapterRange.push(i);
            }
            let interim = chapterRange.map((chapter) => {
                return {chapter: chapter, startVerse: 1, endVerse: getVerseCountForChapter(fullText, term.book, chapter)};
            })
            interim[0].startVerse = startVerse;
            interim[interim.length - 1].endVerse = endVerse;
            return [{book: term.book, ranges: interim}];
        }
    });

    // Convert elements of {book:_ ranges:[{chapter: _, startVerse: _, endVerse: _}, ..]} into full list of [{book:_, chapter:_, verse:_}, ...] elements
    let fullVerseRefs = [];
    results.map((queryResult) => {
        queryResult.map((chapterLevel) => {
            chapterLevel.ranges.map((range) => {
                let subList = []
                for(let i = parseInt(range.startVerse); i <= parseInt(range.endVerse); i++) {
                    console.log("pushing")
                    subList.push({book: chapterLevel.book, chapter: range.chapter, verse: i})
                }
                fullVerseRefs.push(subList);
            });
        });
    });

    return fullVerseRefs;
}

// Takes raw input from search bar, parses it, and returns verse ranges
// Right now, we get a break everytime there is a new chapter. That may be accidentally better behavior. 
// It has to do with making a new "range" element for each chapter, and not re-combining all of the fullverserefs into a single list for each term.
function normalizeQuery(fullText, searchQuery, setResultsFeedback) {
    // Guard against nonsense
    if (searchQuery.length <= 2){
        setResultsFeedback({search: searchQuery, results: -2});
        return [[{book: 100, chapter: 1, verse: 1}]];
    }

    // Split search query on commas to check for refs -> could add semicolon split
    const searchTerms = searchQuery.split(/\s*,\s*/);
    let searchMode = false;
    
    const parsedSearchTerms = searchTerms.map((term) => {
        const fullVerseRegexColon = /(\d*?\s*?\w+)\s+(\d+):(\d+)(?:-(\d+):(\d+))?/;     // John 1:23, John 1:23-1:24, John 1:23-2:34
        const fullVerseRegexNoColon = /(\d*?\s*?\w+)\s+(\d+):(\d+)(?:-(\d+))?/;         // John 1:23-24
        const singleChapterRegex = /(\d*?\s*?\w+)\s+(\d+)(?:-(\d+))?/;                  // John 1, John 1-3
        const partialVerseRegexColon = /(\d+):(\d+)(?:-(\d+))?:?(\d+)?/;                // 1:29, 1:30-31, 1:31-1:32
        const partialVerseRegexVerseRange = /(\d+)(?:-(\d+))?/;                         // 26, 26-27

        let match;

        if ((match = fullVerseRegexColon.exec(term)) && match[4] && match[5]) {
            let book = match[1].toLowerCase().replace(/\s/g, '');
            const startChapter = match[2];
            const startVerse = match[3];
            const endChapter = match[4];
            const endVerse = match[5];
            
            if (endChapter && endVerse) {
                return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, endVerse]};
            } else if (endChapter) {
                return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, startVerse]};
            } else if (endVerse) {
                return {book: book, chapters: [startChapter, startChapter], verses: [startVerse, endVerse]};
            } else {
                return {book: book, chapters: [startChapter, startChapter], verses: [startVerse, startVerse]};
            }
        } else if ((match = fullVerseRegexNoColon.exec(term))) {
            let book = match[1].toLowerCase().replace(/\s/g, '');
            const startChapter = match[2];
            const startVerse = match[3];
            const endChapter = match[2];
            const endVerse = match[4];
            
            if (endChapter && endVerse) {
                return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, endVerse]};
            } else if (endChapter) {
                return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, startVerse]};
            } else if (endVerse) {
                return {book: book, chapters: [startChapter, startChapter], verses: [startVerse, endVerse]};
            } else {
                return {book: book, chapters: [startChapter, startChapter], verses: [startVerse, startVerse]};
            }
        } else if ((match = singleChapterRegex.exec(term))) {
            let book = match[1].toLowerCase().replace(/\s/g, '');
            const startChapter = match[2];
            const endChapter = match[3];

            if (endChapter) {
                return {book: book, chapters: [startChapter, endChapter], verses: [1, getVerseCountForChapter(fullText, getBookNumberFromName(book), endChapter)]}; 
            } else {
                return {book: book, chapters: [startChapter, startChapter], verses: [1, getVerseCountForChapter(fullText, getBookNumberFromName(book), startChapter)]}; 
            }
        } else if ((match = partialVerseRegexColon.exec(term))) {
            const book = "inherit!";
            if (match[4]) {
                const startChapter = match[1];
                const endChapter = match[3];
                const startVerse = match[2];
                const endVerse = match[4];
                
                return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, endVerse]};
            } else {
                const startChapter = match[1];
                const endChapter = match[1];
                const startVerse = match[2];
                const endVerse = match[3];

                if (endVerse) {
                    return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, endVerse]}; 
                } else {
                    return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, startVerse]};
                }
            }
        } else if ((match = partialVerseRegexVerseRange.exec(term))) {
            const book = "inherit!";
            const startChapter = "inherit!";
            const endChapter = "inherit!";
            const startVerse = match[1];
            const endVerse = match[2];

            if (endVerse) {
                return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, endVerse]}; 
            } else {
                return {book: book, chapters: [startChapter, endChapter], verses: [startVerse, startVerse]};
            }
        } else {
            return undefined;
        }
    });

    // Remove non-valid ref elements. If nothing is left, we will enter search mode
    let filteredSearchTerms = parsedSearchTerms.filter((element) => element !== undefined);

    // Inherit book and/or chapter values for partial verse refs
    if (filteredSearchTerms.length !== 0) {
        for (let i = 0; i < filteredSearchTerms.length; i++) {
            const current = filteredSearchTerms[i];
          
            if (current.book === 'inherit!') {
                for (let j = i - 1; j >= 0; j--) {
                    if (filteredSearchTerms[j].book !== 'inherit!') {
                        current.book = filteredSearchTerms[j].book;
                        break;
                    }
                }
            }

            if (current.chapters[0] === 'inherit!' || current.chapters[1] === 'inherit') {
                for (let j = i - 1; j >= 0; j--) {
                    if (filteredSearchTerms[j].chapters[0] !== 'inherit!') {
                        current.chapters[0] = filteredSearchTerms[j].chapters[1];
                        current.chapters[1] = filteredSearchTerms[j].chapters[1];
                        break;
                    }
                }
            }
          }
    } else {
        searchMode = true;
    }

    if (!searchMode) {
        // Transform book names into their corresponding number
        filteredSearchTerms.map((term) => {
            term.book = getBookNumberFromName(term.book);
        });

        const verseRefs = getVerseRefs(fullText, filteredSearchTerms);

        // Filter out any verse refs that don't exist
        const filteredVerseRefs = verseRefs.map((listOfRefs) => 
            listOfRefs.filter((ref) => {
                if (fullText[ref.book] === undefined) {
                    return false;
                } else if (fullText[ref.book][ref.chapter] === undefined) {
                    return false;
                } else if (fullText[ref.book][ref.chapter][ref.verse - 1] === undefined) {
                    return false;
                } else {
                    return true;
                }
            }
            )
        )
        .filter((list) => list.length > 0);

        if (filteredVerseRefs.length !==0  && filteredVerseRefs[0].length !== 0) {
            setResultsFeedback({search: searchQuery, results: -3});
            return filteredVerseRefs;
        } else {
            setResultsFeedback({search: searchQuery, results: 0});
            return [[{book: 100, chapter: 1, verse: 1}]];
        }

    } else {
        let matchingVerses = [];

        // If first and last chars are both ", perform a strict search
        const firstChar = searchQuery[0];
        const lastChar = searchQuery[searchQuery.length - 1];
        const searchQueryStrippedQuotes = searchQuery.toLowerCase().substring(1, searchQuery.length - 1);

        if (firstChar === '"' && lastChar === '"') {
            for (const book in fullText) {
                for (const chapter in fullText[book]) {
                    for (const verseNumber in fullText[book][chapter]) {
                        const verseText = fullText[book][chapter][verseNumber];
    
                        if (verseText.toLowerCase().includes(searchQueryStrippedQuotes)) {
                            const matchingVerse = {
                                book: book,
                                chapter: chapter,
                                verse: parseInt(verseNumber) + 1
                            };
    
                            matchingVerses.push([matchingVerse]);
                        }
                    }
                }
            }
        } else {      // Else perform a loose search
            const lowerCaseQuery = searchQuery.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const pattern = new RegExp(lowerCaseQuery.split(/\s+/).join('.*'), 'i');

            for (const book in fullText) {
                for (const chapter in fullText[book]) {
                    for (const verseNumber in fullText[book][chapter]) {
                        const verseText = fullText[book][chapter][verseNumber];

                        if (pattern.test(verseText)) {
                            const matchingVerse = {
                                book: book,
                                chapter: chapter,
                                verse: parseInt(verseNumber) + 1
                            };

                            matchingVerses.push([matchingVerse]);
                        }
                    }
                }
            }
        }

        if (matchingVerses.length === 0) {
            setResultsFeedback({search: searchQuery, results: 0});
            return [[{book: 100, chapter: 1, verse: 1}]];     // Represents no results found, either for references, or search
        }
        else if (matchingVerses.length > 1000) {
            setResultsFeedback({search: searchQuery, results: -4});
            return matchingVerses.slice(0, 1000);
        }
        else {
            setResultsFeedback({search: searchQuery, results: matchingVerses.length});
            return matchingVerses;
        }

    }

}

function getBookNumberFromName(book) {
    if (book.includes("genesis") || book.includes("gen")) {
            return 1;
        } else if(book.includes("exodus") || book.includes("ex")) {
            return 2;
        } else if(book.includes("leviticus") || book.includes("lev")) {
            return 3;
        } else if(book.includes("numbers") || book.includes("num")) {
            return 4;
        } else if(book.includes("deuteronomy") || book.includes("deu") || book.includes("deut")) {
            return 5;
        } else if(book.includes("joshua") || book.includes("josh")) {
            return 6;
        } else if(book.includes("judges") || book.includes("judg")) {
            return 7;
        } else if(book.includes("ruth")) {
            return 8;
        } else if(book.includes("1samuel") || book.includes("1sam")) {
            return 9;
        } else if(book.includes("2samuel") || book.includes("2sam")) {
            return 10;
        } else if(book.includes("1kings") || book.includes("1ki")) {
            return 11;
        } else if(book.includes("2kings") || book.includes("2ki")) {
            return 12;
        } else if(book.includes("1chronicles") || book.includes("1chro") || book.includes("1chron")) {
            return 13;
        } else if(book.includes("2chronicles") || book.includes("2chro") || book.includes("2chron")) {
            return 14;
        } else if(book.includes("ezra")) {
            return 15;
        } else if(book.includes("nehemia") || book.includes("neh")) {
            return 16;
        } else if(book.includes("esther") || book.includes("esth")) {
            return 17;
        } else if(book.includes("job")) {
            return 18;
        } else if(book.includes("psalms") || book.includes("psalm") || book === "ps") {
            return 19;
        } else if(book.includes("proverbs") || book.includes("prov")) {
            return 20;
        } else if(book.includes("ecclesiastes") || book.includes("ecc") || book.includes("eccl")) {
            return 21;
        } else if(book.includes("songofsolomon") || book.includes("song")) {
            return 22;
        } else if(book.includes("isaiah") || book === "isa" || book === "is") {
            return 23;
        } else if(book.includes("jeremiah") || book.includes("jer")) {
            return 24;
        } else if(book.includes("lamentations") || book.includes("lam")) {
            return 25;
        } else if(book.includes("ezekiel") || book.includes("ezek")) {
            return 26;
        } else if(book.includes("daniel") || book.includes("dan")) {
            return 27;
        } else if(book.includes("hosea") || book === "hos") {
            return 28;
        } else if(book.includes("joel")) {
            return 29;
        } else if(book.includes("amos")) {
            return 30;
        } else if(book.includes("obadiah") || book.includes("obad")) {
            return 31;
        } else if(book.includes("jonah")) {
            return 32;
        } else if(book.includes("micah") || book === "mic") {
            return 33;
        } else if(book.includes("nahum") || book === "nah") {
            return 34;
        } else if(book.includes("habakkuk") || book.includes("hab")) {
            return 35;
        } else if(book.includes("zephaniah") || book.includes("zeph") || book === "zep") {
            return 36;
        } else if(book.includes("haggai") || book.includes("hag")) {
            return 37;
        } else if(book.includes("zechariah") || book.includes("zech")) {
            return 38;
        } else if(book.includes("malachi") || book.includes("mal")) {
            return 39;
        } else if(book.includes("matthew") || book.includes("matt") || book.includes("mat")) {
            return 40;
        } else if(book.includes("mark")) {
            return 41;
        } else if(book.includes("luke") || book === "luk") {
            return 42;
        } else if(book === "john") {
            return 43;
        } else if(book.includes("acts") || book.includes("act")) {
            return 44;
        } else if(book.includes("romans") || book === "rom") {
            return 45;
        } else if(book.includes("1corinthians") || book.includes("1cor")) {
            return 46;
        } else if(book.includes("2corinthians") || book.includes("2cor")) {
            return 47;
        } else if(book.includes("galatians") || book === "gal") {
            return 48;
        } else if(book.includes("ephesians") || book === "eph") {
            return 49;
        } else if(book.includes("philippians") || book.includes("philip") || book === "phil") {
            return 50;
        } else if(book.includes("colossians") || book === "col") {
            return 51;
        } else if(book.includes("1thessalonians") || book.includes("1thess")) {
            return 52;
        } else if(book.includes("2thessalonians") || book.includes("2thess")) {
            return 53;
        } else if(book.includes("1timothy") || book.includes("1tim")) {
            return 54;
        } else if(book.includes("2timothy") || book.includes("2tim")) {
            return 55;
        } else if(book.includes("titus")) {
            return 56;
        } else if(book.includes("philemon") || book.includes("philem")) {
            return 57;
        } else if(book.includes("hebrews") || book.includes("heb")) {
            return 58;
        } else if(book.includes("james") || book === "jas") {
            return 59;
        } else if(book.includes("1peter") || book.includes("1pet")) {
            return 60;
        } else if(book.includes("2peter") || book.includes("2pet")) {
            return 61;
        } else if(book === "1john") {
            return 62;
        } else if(book === "2john") {
            return 63;
        } else if(book === "3john") {
            return 64;
        } else if(book.includes("jude")) {
            return 65;
        } else if(book.includes("revelation") || book === "rev") {
            return 66;
        } else {
            return 100;       // Exception case
        }
}

