import * as JSZip from "jszip";
import { parseString } from "xml2js-preserve-spaces";
export const docxToString = async (docxFile) => {
    return new Promise((resolve, reject) => {
        // unzip the file
        const zip = new JSZip();
        zip.loadAsync(docxFile).then(function (zip) {
            // get the content of the document.xml file
            const wordFolder = zip.folder("word");
            if (!wordFolder) {
                reject(`An error ocurred attempting to enter to the folder 'word' of the docx file.`);
                return;
            }
            const file = wordFolder.file("document.xml");
            if (!file) {
                reject(`An error ocurred attempting to enter to the load the file 'document.xml' in folder 'word' of the docx file.`);
                return;
            }
            file.async("string").then(function (XMLContent) {
                parseString(XMLContent, function (err, result) {
                    const paragraphs = result["w:document"]["w:body"][0]["w:p"];
                    let docxInTxt = "";
                    paragraphs.forEach((paragraph) => {
                        let textInTheParagraph = "";
                        const saveTheParagraph = () => {
                            textInTheParagraph += "\r\n";
                            docxInTxt += textInTheParagraph;
                        };
                        const WRLabel = paragraph["w:r"];
                        if (!WRLabel || !WRLabel.length) {
                            saveTheParagraph();
                            return;
                        }
                        WRLabel.forEach((WR) => {
                            let text = "";
                            const WTLabel = WR["w:t"];
                            // check if WTLabel is an object and has the "_" property
                            if (WTLabel && WTLabel.length && WTLabel[0]["_"]) {
                                text = WTLabel[0]["_"];
                            }
                            else {
                                if (WTLabel &&
                                    WTLabel.length &&
                                    typeof WTLabel[0] === "string") {
                                    text = WTLabel[0];
                                }
                                else {
                                    if (WTLabel && WTLabel.length && WTLabel[0]["$"]) {
                                        text = " ";
                                    }
                                }
                            }
                            textInTheParagraph += text;
                        });
                        saveTheParagraph();
                    });
                    resolve(docxInTxt);
                });
            });
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jeFRvU3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2RvY3hQYXJzZXJzL2RvY3hUb1N0cmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHckQsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEtBQUssRUFDL0IsUUFBeUIsRUFDUixFQUFFO0lBQ25CLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsaUJBQWlCO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDeEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHO1lBQ3hDLDJDQUEyQztZQUMzQyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2YsTUFBTSxDQUNKLDZFQUE2RSxDQUM5RSxDQUFDO2dCQUNGLE9BQU87YUFDUjtZQUNELE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxNQUFNLENBQ0osNkdBQTZHLENBQzlHLENBQUM7Z0JBQ0YsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxVQUFVO2dCQUM1QyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxFQUFFLE1BQU07b0JBQzNDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDNUQsSUFBSSxTQUFTLEdBQVcsRUFBRSxDQUFDO29CQUUzQixVQUFVLENBQUMsT0FBTyxDQUNoQixDQUFDLFNBQW9ELEVBQUUsRUFBRTt3QkFDdkQsSUFBSSxrQkFBa0IsR0FBVyxFQUFFLENBQUM7d0JBQ3BDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFOzRCQUM1QixrQkFBa0IsSUFBSSxNQUFNLENBQUM7NEJBQzdCLFNBQVMsSUFBSSxrQkFBa0IsQ0FBQzt3QkFDbEMsQ0FBQyxDQUFDO3dCQUNGLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDakMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7NEJBQy9CLGdCQUFnQixFQUFFLENBQUM7NEJBQ25CLE9BQU87eUJBQ1I7d0JBQ0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTBCLEVBQUUsRUFBRTs0QkFDN0MsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDOzRCQUN0QixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQzFCLHlEQUF5RDs0QkFDekQsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0NBQ2hELElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7NkJBQ3hCO2lDQUFNO2dDQUNMLElBQ0UsT0FBTztvQ0FDUCxPQUFPLENBQUMsTUFBTTtvQ0FDZCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQzlCO29DQUNBLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQ25CO3FDQUFNO29DQUNMLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dDQUNoRCxJQUFJLEdBQUcsR0FBRyxDQUFDO3FDQUNaO2lDQUNGOzZCQUNGOzRCQUNELGtCQUFrQixJQUFJLElBQUksQ0FBQzt3QkFDN0IsQ0FBQyxDQUFDLENBQUM7d0JBQ0gsZ0JBQWdCLEVBQUUsQ0FBQztvQkFDckIsQ0FBQyxDQUNGLENBQUM7b0JBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEpTWmlwIGZyb20gXCJqc3ppcFwiO1xyXG5pbXBvcnQgeyBwYXJzZVN0cmluZyB9IGZyb20gXCJ4bWwyanMtcHJlc2VydmUtc3BhY2VzXCI7XHJcbmltcG9ydCB7IElucHV0RmlsZUZvcm1hdCB9IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZG9jeFRvU3RyaW5nID0gYXN5bmMgKFxyXG4gIGRvY3hGaWxlOiBJbnB1dEZpbGVGb3JtYXRcclxuKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgLy8gdW56aXAgdGhlIGZpbGVcclxuICAgIGNvbnN0IHppcCA9IG5ldyBKU1ppcCgpO1xyXG4gICAgemlwLmxvYWRBc3luYyhkb2N4RmlsZSkudGhlbihmdW5jdGlvbiAoemlwKSB7XHJcbiAgICAgIC8vIGdldCB0aGUgY29udGVudCBvZiB0aGUgZG9jdW1lbnQueG1sIGZpbGVcclxuICAgICAgY29uc3Qgd29yZEZvbGRlciA9IHppcC5mb2xkZXIoXCJ3b3JkXCIpO1xyXG4gICAgICBpZiAoIXdvcmRGb2xkZXIpIHtcclxuICAgICAgICByZWplY3QoXHJcbiAgICAgICAgICBgQW4gZXJyb3Igb2N1cnJlZCBhdHRlbXB0aW5nIHRvIGVudGVyIHRvIHRoZSBmb2xkZXIgJ3dvcmQnIG9mIHRoZSBkb2N4IGZpbGUuYFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGZpbGUgPSB3b3JkRm9sZGVyLmZpbGUoXCJkb2N1bWVudC54bWxcIik7XHJcbiAgICAgIGlmICghZmlsZSkge1xyXG4gICAgICAgIHJlamVjdChcclxuICAgICAgICAgIGBBbiBlcnJvciBvY3VycmVkIGF0dGVtcHRpbmcgdG8gZW50ZXIgdG8gdGhlIGxvYWQgdGhlIGZpbGUgJ2RvY3VtZW50LnhtbCcgaW4gZm9sZGVyICd3b3JkJyBvZiB0aGUgZG9jeCBmaWxlLmBcclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBmaWxlLmFzeW5jKFwic3RyaW5nXCIpLnRoZW4oZnVuY3Rpb24gKFhNTENvbnRlbnQpIHtcclxuICAgICAgICBwYXJzZVN0cmluZyhYTUxDb250ZW50LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFncmFwaHMgPSByZXN1bHRbXCJ3OmRvY3VtZW50XCJdW1widzpib2R5XCJdWzBdW1widzpwXCJdO1xyXG4gICAgICAgICAgbGV0IGRvY3hJblR4dDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICBwYXJhZ3JhcGhzLmZvckVhY2goXHJcbiAgICAgICAgICAgIChwYXJhZ3JhcGg6IHsgW3g6IHN0cmluZ106IHsgW3g6IHN0cmluZ106IGFueVtdIH1bXSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgbGV0IHRleHRJblRoZVBhcmFncmFwaDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICAgICAgICBjb25zdCBzYXZlVGhlUGFyYWdyYXBoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGV4dEluVGhlUGFyYWdyYXBoICs9IFwiXFxyXFxuXCI7XHJcbiAgICAgICAgICAgICAgICBkb2N4SW5UeHQgKz0gdGV4dEluVGhlUGFyYWdyYXBoO1xyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgY29uc3QgV1JMYWJlbCA9IHBhcmFncmFwaFtcInc6clwiXTtcclxuICAgICAgICAgICAgICBpZiAoIVdSTGFiZWwgfHwgIVdSTGFiZWwubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlVGhlUGFyYWdyYXBoKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIFdSTGFiZWwuZm9yRWFjaCgoV1I6IHsgW3g6IHN0cmluZ106IGFueVtdIH0pID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgV1RMYWJlbCA9IFdSW1widzp0XCJdO1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgV1RMYWJlbCBpcyBhbiBvYmplY3QgYW5kIGhhcyB0aGUgXCJfXCIgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgIGlmIChXVExhYmVsICYmIFdUTGFiZWwubGVuZ3RoICYmIFdUTGFiZWxbMF1bXCJfXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQgPSBXVExhYmVsWzBdW1wiX1wiXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBXVExhYmVsICYmXHJcbiAgICAgICAgICAgICAgICAgICAgV1RMYWJlbC5sZW5ndGggJiZcclxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgV1RMYWJlbFswXSA9PT0gXCJzdHJpbmdcIlxyXG4gICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gV1RMYWJlbFswXTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoV1RMYWJlbCAmJiBXVExhYmVsLmxlbmd0aCAmJiBXVExhYmVsWzBdW1wiJFwiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGV4dEluVGhlUGFyYWdyYXBoICs9IHRleHQ7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgc2F2ZVRoZVBhcmFncmFwaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIHJlc29sdmUoZG9jeEluVHh0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuIl19