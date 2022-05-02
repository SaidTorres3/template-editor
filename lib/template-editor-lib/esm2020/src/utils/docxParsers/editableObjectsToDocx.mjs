import * as JSZipImport from "jszip";
import xml2js from 'xml2js-preserve-spaces';
export const editableObjectToDocx = async (opts) => {
    const JSZip = typeof JSZipImport === "function" ? JSZipImport : JSZipImport["default"];
    return new Promise((resolve, reject) => {
        // unzip the file
        const zipHandler = new JSZip();
        zipHandler.loadAsync(opts.fileIn).then(function (zipContent) {
            const file = zipContent.file("word/document.xml");
            if (!file) {
                reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`);
                return;
            }
            file.async('text').then(function (XMLContent) {
                xml2js.parseString(XMLContent, function (err, result) {
                    const paragraphs = result['w:document']['w:body'][0]['w:p'];
                    paragraphs.forEach((paragraph, paragraphIndex) => {
                        const wRLabels = paragraph['w:r'];
                        if (!wRLabels || !wRLabels.length) {
                            return paragraph;
                        }
                        wRLabels.forEach((wRLabel, wRLabelIndex) => {
                            const modfiedPhrase = getModifiedPhrase(opts.modifiedObjects, { paragraphIndex, sentenseIndex: wRLabelIndex });
                            if (!modfiedPhrase) {
                                return paragraph;
                            }
                            // check if WTLabel is an object and has the "_" property
                            if (wRLabel['w:t'] && wRLabel['w:t'].length && wRLabel['w:t'][0]['_']) {
                                wRLabel['w:t'][0]['_'] = modfiedPhrase.value;
                            }
                            else {
                                if (wRLabel['w:t'] && wRLabel['w:t'].length && typeof wRLabel['w:t'][0] === 'string') {
                                    wRLabel['w:t'][0] = modfiedPhrase.value;
                                }
                            }
                        });
                    });
                    const modifiedXML = new xml2js.Builder().buildObject(result);
                    // replace 'file' variable with modifiedXML
                    zipContent.file('word/document.xml', modifiedXML);
                    zipContent.generateAsync({ type: 'blob' }).then(function (outputFile) {
                        resolve(outputFile);
                    });
                });
            });
        });
    });
};
const getModifiedPhrase = (phrases, phaseCoords) => {
    const phrase = phrases.find((phrase) => {
        if (phrase.paragraphIndex === phaseCoords.paragraphIndex && phrase.sentenseIndex === phaseCoords.sentenseIndex) {
            return phrase;
        }
    });
    return phrase;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdGFibGVPYmplY3RzVG9Eb2N4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RvY3hQYXJzZXJzL2VkaXRhYmxlT2JqZWN0c1RvRG9jeC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssV0FBVyxNQUFNLE9BQU8sQ0FBQztBQUNyQyxPQUFPLE1BQU0sTUFBTSx3QkFBd0IsQ0FBQTtBQUczQyxNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxLQUFLLEVBQUUsSUFBOEIsRUFBaUIsRUFBRTtJQUMxRixNQUFNLEtBQUssR0FBRyxPQUFPLFdBQVcsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZGLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsaUJBQWlCO1FBQ2pCLE1BQU0sVUFBVSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDL0IsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsVUFBVTtZQUN6RCxNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDakQsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFBRSxNQUFNLENBQUMsNkdBQTZHLENBQUMsQ0FBQztnQkFBQyxPQUFNO2FBQUU7WUFFNUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxVQUFVO2dCQUMxQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLEdBQUcsRUFBRSxNQUFNO29CQUNsRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQzNELFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFzRCxFQUFFLGNBQXNCLEVBQUUsRUFBRTt3QkFDcEcsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUNqQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTs0QkFBRSxPQUFPLFNBQVMsQ0FBQTt5QkFBRTt3QkFDdkQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQWdDLEVBQUUsWUFBWSxFQUFFLEVBQUU7NEJBQ2xFLE1BQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRSxjQUFjLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUE7NEJBQzlHLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0NBQUUsT0FBTyxTQUFTLENBQUE7NkJBQUU7NEJBQ3hDLHlEQUF5RDs0QkFDekQsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0NBQ3JFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFBOzZCQUM3QztpQ0FBTTtnQ0FDTCxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQ0FDcEYsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUE7aUNBQ3hDOzZCQUNGO3dCQUNILENBQUMsQ0FBQyxDQUFBO29CQUNKLENBQUMsQ0FBQyxDQUFBO29CQUNGLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDNUQsMkNBQTJDO29CQUMzQyxVQUFVLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyxDQUFBO29CQUNqRCxVQUFVLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsVUFBVTt3QkFDbEUsT0FBTyxDQUFDLFVBQWtCLENBQUMsQ0FBQTtvQkFDN0IsQ0FBQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFFRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsT0FBeUIsRUFBRSxXQUF5QixFQUE4QixFQUFFO0lBQzdHLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFzQixFQUFFLEVBQUU7UUFDckQsSUFBSSxNQUFNLENBQUMsY0FBYyxLQUFLLFdBQVcsQ0FBQyxjQUFjLElBQUksTUFBTSxDQUFDLGFBQWEsS0FBSyxXQUFXLENBQUMsYUFBYSxFQUFFO1lBQzlHLE9BQU8sTUFBTSxDQUFBO1NBQ2Q7SUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sTUFBTSxDQUFBO0FBQ2YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgSlNaaXBJbXBvcnQgZnJvbSBcImpzemlwXCI7XHJcbmltcG9ydCB4bWwyanMgZnJvbSAneG1sMmpzLXByZXNlcnZlLXNwYWNlcydcclxuaW1wb3J0IHsgRWRpdGFibGVPYmplY3RUb0RvY3hPcHRzLCBFZGl0YWJsZVBocmFzZSwgUGhyYXNlQ29vcmRzIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgZWRpdGFibGVPYmplY3RUb0RvY3ggPSBhc3luYyAob3B0czogRWRpdGFibGVPYmplY3RUb0RvY3hPcHRzKTogUHJvbWlzZTxGaWxlPiA9PiB7XHJcbiAgY29uc3QgSlNaaXAgPSB0eXBlb2YgSlNaaXBJbXBvcnQgPT09IFwiZnVuY3Rpb25cIiA/IEpTWmlwSW1wb3J0IDogSlNaaXBJbXBvcnRbXCJkZWZhdWx0XCJdO1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAvLyB1bnppcCB0aGUgZmlsZVxyXG4gICAgY29uc3QgemlwSGFuZGxlciA9IG5ldyBKU1ppcCgpO1xyXG4gICAgemlwSGFuZGxlci5sb2FkQXN5bmMob3B0cy5maWxlSW4pLnRoZW4oZnVuY3Rpb24gKHppcENvbnRlbnQpIHtcclxuICAgICAgY29uc3QgZmlsZSA9IHppcENvbnRlbnQuZmlsZShcIndvcmQvZG9jdW1lbnQueG1sXCIpXHJcbiAgICAgIGlmICghZmlsZSkgeyByZWplY3QoYEFuIGVycm9yIG9jdXJyZWQgYXR0ZW1wdGluZyB0byBlbnRlciB0byB0aGUgbG9hZCB0aGUgZmlsZSAnZG9jdW1lbnQueG1sJyBpbiBmb2xkZXIgJ3dvcmQnIG9mIHRoZSBkb2N4IGZpbGUuYCk7IHJldHVybiB9XHJcblxyXG4gICAgICBmaWxlLmFzeW5jKCd0ZXh0JykudGhlbihmdW5jdGlvbiAoWE1MQ29udGVudCkge1xyXG4gICAgICAgIHhtbDJqcy5wYXJzZVN0cmluZyhYTUxDb250ZW50LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFncmFwaHMgPSByZXN1bHRbJ3c6ZG9jdW1lbnQnXVsndzpib2R5J11bMF1bJ3c6cCddXHJcbiAgICAgICAgICBwYXJhZ3JhcGhzLmZvckVhY2goKHBhcmFncmFwaDogeyBbeDogc3RyaW5nXTogeyBbeDogc3RyaW5nXTogYW55W107IH1bXTsgfSwgcGFyYWdyYXBoSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3UkxhYmVscyA9IHBhcmFncmFwaFsndzpyJ11cclxuICAgICAgICAgICAgaWYgKCF3UkxhYmVscyB8fCAhd1JMYWJlbHMubGVuZ3RoKSB7IHJldHVybiBwYXJhZ3JhcGggfVxyXG4gICAgICAgICAgICB3UkxhYmVscy5mb3JFYWNoKCh3UkxhYmVsOiB7IFt4OiBzdHJpbmddOiBhbnlbXTsgfSwgd1JMYWJlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbW9kZmllZFBocmFzZSA9IGdldE1vZGlmaWVkUGhyYXNlKG9wdHMubW9kaWZpZWRPYmplY3RzLCB7IHBhcmFncmFwaEluZGV4LCBzZW50ZW5zZUluZGV4OiB3UkxhYmVsSW5kZXggfSlcclxuICAgICAgICAgICAgICBpZiAoIW1vZGZpZWRQaHJhc2UpIHsgcmV0dXJuIHBhcmFncmFwaCB9XHJcbiAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgV1RMYWJlbCBpcyBhbiBvYmplY3QgYW5kIGhhcyB0aGUgXCJfXCIgcHJvcGVydHlcclxuICAgICAgICAgICAgICBpZiAod1JMYWJlbFsndzp0J10gJiYgd1JMYWJlbFsndzp0J10ubGVuZ3RoICYmIHdSTGFiZWxbJ3c6dCddWzBdWydfJ10pIHtcclxuICAgICAgICAgICAgICAgIHdSTGFiZWxbJ3c6dCddWzBdWydfJ10gPSBtb2RmaWVkUGhyYXNlLnZhbHVlXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh3UkxhYmVsWyd3OnQnXSAmJiB3UkxhYmVsWyd3OnQnXS5sZW5ndGggJiYgdHlwZW9mIHdSTGFiZWxbJ3c6dCddWzBdID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICB3UkxhYmVsWyd3OnQnXVswXSA9IG1vZGZpZWRQaHJhc2UudmFsdWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgY29uc3QgbW9kaWZpZWRYTUwgPSBuZXcgeG1sMmpzLkJ1aWxkZXIoKS5idWlsZE9iamVjdChyZXN1bHQpXHJcbiAgICAgICAgICAvLyByZXBsYWNlICdmaWxlJyB2YXJpYWJsZSB3aXRoIG1vZGlmaWVkWE1MXHJcbiAgICAgICAgICB6aXBDb250ZW50LmZpbGUoJ3dvcmQvZG9jdW1lbnQueG1sJywgbW9kaWZpZWRYTUwpXHJcbiAgICAgICAgICB6aXBDb250ZW50LmdlbmVyYXRlQXN5bmMoeyB0eXBlOiAnYmxvYicgfSkudGhlbihmdW5jdGlvbiAob3V0cHV0RmlsZSkge1xyXG4gICAgICAgICAgICByZXNvbHZlKG91dHB1dEZpbGUgYXMgRmlsZSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9KVxyXG59XHJcblxyXG5jb25zdCBnZXRNb2RpZmllZFBocmFzZSA9IChwaHJhc2VzOiBFZGl0YWJsZVBocmFzZVtdLCBwaGFzZUNvb3JkczogUGhyYXNlQ29vcmRzKTogRWRpdGFibGVQaHJhc2UgfCB1bmRlZmluZWQgPT4ge1xyXG4gIGNvbnN0IHBocmFzZSA9IHBocmFzZXMuZmluZCgocGhyYXNlOiBFZGl0YWJsZVBocmFzZSkgPT4ge1xyXG4gICAgaWYgKHBocmFzZS5wYXJhZ3JhcGhJbmRleCA9PT0gcGhhc2VDb29yZHMucGFyYWdyYXBoSW5kZXggJiYgcGhyYXNlLnNlbnRlbnNlSW5kZXggPT09IHBoYXNlQ29vcmRzLnNlbnRlbnNlSW5kZXgpIHtcclxuICAgICAgcmV0dXJuIHBocmFzZVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgcmV0dXJuIHBocmFzZVxyXG59Il19