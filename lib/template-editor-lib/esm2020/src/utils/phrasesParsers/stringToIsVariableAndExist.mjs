export const stringToIsVariableAndExist = (text, data) => {
    const result = [];
    // const isVariableRegex = /([^({\s]+\.[^})\s]+)/g;
    const isVariableRegex = /([^({}\s]+\w\.[^{})\s]+)/g;
    // separe the matches and non matches into an array of objects:
    text.split(isVariableRegex).forEach((part) => {
        const isThereAMatchWithRegex = part.match(isVariableRegex)?.length;
        let isVariable = false, exist = false;
        if (isThereAMatchWithRegex) {
            isVariable = true;
            exist = checkIfPathExists(data, part);
        }
        result.push({
            value: part,
            isVariable,
            exist,
        });
    });
    return result;
};
// function that checks if a path exists in an object
function checkIfPathExists(obj, path) {
    return path
        .trim()
        .split(".")
        .every(function (key) {
        if (obj) {
            const objProps = obj["properties"];
            if (objProps) {
                obj = objProps;
            }
            obj = obj[key];
        }
        return obj;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nVG9Jc1ZhcmlhYmxlQW5kRXhpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvdXRpbHMvcGhyYXNlc1BhcnNlcnMvc3RyaW5nVG9Jc1ZhcmlhYmxlQW5kRXhpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUcsQ0FDeEMsSUFBWSxFQUNaLElBQVMsRUFDYSxFQUFFO0lBQ3hCLE1BQU0sTUFBTSxHQUF5QixFQUFFLENBQUM7SUFDeEMsbURBQW1EO0lBQ25ELE1BQU0sZUFBZSxHQUFHLDJCQUEyQixDQUFDO0lBQ3BELCtEQUErRDtJQUMvRCxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQzNDLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRSxNQUFNLENBQUM7UUFDbkUsSUFBSSxVQUFVLEdBQUcsS0FBSyxFQUNwQixLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLElBQUksc0JBQXNCLEVBQUU7WUFDMUIsVUFBVSxHQUFHLElBQUksQ0FBQztZQUNsQixLQUFLLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNWLEtBQUssRUFBRSxJQUFJO1lBQ1gsVUFBVTtZQUNWLEtBQUs7U0FDTixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLHFEQUFxRDtBQUNyRCxTQUFTLGlCQUFpQixDQUFDLEdBQVEsRUFBRSxJQUFZO0lBQy9DLE9BQU8sSUFBSTtTQUNSLElBQUksRUFBRTtTQUNOLEtBQUssQ0FBQyxHQUFHLENBQUM7U0FDVixLQUFLLENBQUMsVUFBVSxHQUFHO1FBQ2xCLElBQUksR0FBRyxFQUFFO1lBQ1AsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25DLElBQUksUUFBUSxFQUFFO2dCQUNaLEdBQUcsR0FBRyxRQUFRLENBQUM7YUFDaEI7WUFDRCxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1ZhcmlhYmxlQW5kRXhpc3QgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHN0cmluZ1RvSXNWYXJpYWJsZUFuZEV4aXN0ID0gKFxyXG4gIHRleHQ6IHN0cmluZyxcclxuICBkYXRhOiBhbnlcclxuKTogaXNWYXJpYWJsZUFuZEV4aXN0W10gPT4ge1xyXG4gIGNvbnN0IHJlc3VsdDogaXNWYXJpYWJsZUFuZEV4aXN0W10gPSBbXTtcclxuICAvLyBjb25zdCBpc1ZhcmlhYmxlUmVnZXggPSAvKFteKHtcXHNdK1xcLltefSlcXHNdKykvZztcclxuICBjb25zdCBpc1ZhcmlhYmxlUmVnZXggPSAvKFteKHt9XFxzXStcXHdcXC5bXnt9KVxcc10rKS9nO1xyXG4gIC8vIHNlcGFyZSB0aGUgbWF0Y2hlcyBhbmQgbm9uIG1hdGNoZXMgaW50byBhbiBhcnJheSBvZiBvYmplY3RzOlxyXG4gIHRleHQuc3BsaXQoaXNWYXJpYWJsZVJlZ2V4KS5mb3JFYWNoKChwYXJ0KSA9PiB7XHJcbiAgICBjb25zdCBpc1RoZXJlQU1hdGNoV2l0aFJlZ2V4ID0gcGFydC5tYXRjaChpc1ZhcmlhYmxlUmVnZXgpPy5sZW5ndGg7XHJcbiAgICBsZXQgaXNWYXJpYWJsZSA9IGZhbHNlLFxyXG4gICAgICBleGlzdCA9IGZhbHNlO1xyXG4gICAgaWYgKGlzVGhlcmVBTWF0Y2hXaXRoUmVnZXgpIHtcclxuICAgICAgaXNWYXJpYWJsZSA9IHRydWU7XHJcbiAgICAgIGV4aXN0ID0gY2hlY2tJZlBhdGhFeGlzdHMoZGF0YSwgcGFydCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICB2YWx1ZTogcGFydCxcclxuICAgICAgaXNWYXJpYWJsZSxcclxuICAgICAgZXhpc3QsXHJcbiAgICB9KTtcclxuICB9KTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxuLy8gZnVuY3Rpb24gdGhhdCBjaGVja3MgaWYgYSBwYXRoIGV4aXN0cyBpbiBhbiBvYmplY3RcclxuZnVuY3Rpb24gY2hlY2tJZlBhdGhFeGlzdHMob2JqOiBhbnksIHBhdGg6IHN0cmluZykge1xyXG4gIHJldHVybiBwYXRoXHJcbiAgICAudHJpbSgpXHJcbiAgICAuc3BsaXQoXCIuXCIpXHJcbiAgICAuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqUHJvcHMgPSBvYmpbXCJwcm9wZXJ0aWVzXCJdO1xyXG4gICAgICAgIGlmIChvYmpQcm9wcykge1xyXG4gICAgICAgICAgb2JqID0gb2JqUHJvcHM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9iaiA9IG9ialtrZXldO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9KTtcclxufVxyXG4iXX0=