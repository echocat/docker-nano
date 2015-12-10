var version = arguments[0];

function versionPartsToString(parts) {
	var str = "";
	for (var i = 0; i < parts.length; i++) {
		var element = parts[i];
		if (str.length > 0) {
			str += element.separator;
		}
		str += element.id;
	}
	return str;
}

function splitVersion(versionString) {
	var result = [];
	var current = versionString;
	var i = Math.max(current.lastIndexOf('.'), current.lastIndexOf('-'), current.lastIndexOf('_'), current.lastIndexOf(','));
	
	while (i > 0) {
		var element = {
			full: current,
			left: current.substring(0, i),
			startIndex: i + 1,
			id: current.substr(i + 1),
			separator: current.substring(i, i + 1)
		};
		element.idAsNumber = parseInt(element.id);
		element.isNumber = !isNaN(element.idAsNumber);
		result.push(element);
		
		current = current.substr(0,i);
		i = Math.max(current.lastIndexOf('.'), current.lastIndexOf('-'), current.lastIndexOf('_'), current.lastIndexOf(','));
	}
	var element = {
		full: current,
		left: null,
		startIndex: 0,
		id: current,
		separator: null
	};
	element.idAsNumber = parseInt(element.id);
	element.isNumber = !isNaN(element.idAsNumber);
	result.push(element);
	return result.reverse();
}

function isLatestVersion(parts) {
	return (parts.length == 1 && parts[0].id == 'latest');
}

function compareVersions(aParts,bParts,invertNotANumberCheck) {
	var result = 0;

	if (isLatestVersion(aParts) && !isLatestVersion(bParts)) {
		result = -1;
	} else if (!isLatestVersion(aParts) && isLatestVersion(bParts)) {
		result = 1;
	} else {
		for (var i = 0; result == 0 && i < aParts.length && i < bParts.length; i++) {
			var aPart = aParts[i];
			var bPart = bParts[i];
			if (!aPart && !bPart) {
				result = 0;
			} else if (aPart.isNumber && !bPart.isNumber) {
				result = -1 * (invertNotANumberCheck ? -1 : 1);
			} else if (!aPart.isNumber && bPart.isNumber) {
				result = 1 * (invertNotANumberCheck ? -1 : 1);
			} else if (!aPart.isNumber && !bPart.isNumber) {
				result = aPart.id.localeCompare(bPart.id);
			} else {
				result = aPart.idAsNumber - bPart.idAsNumber;
			}
		}
		if (result == 0) {
			result = aParts.length - bParts.length;
		}
	}

	return result;
}

function compareVersionObjects(a,b) {
	var aName = typeof a.name === "string" ? a.name : '';
	var bName = typeof b.name === "string" ? b.name : '';

	return compareVersions(splitVersion(aName), splitVersion(bName));
}

tags=tags.sort(compareVersionObjects);

var versionParts = splitVersion(version);

for (var i = versionParts.length - 2; i >= -1; i--) {
	var foundHigherCandidate = false;
	var currentParts = versionParts.slice(0, i + 1);
	var currentPartsAsString = versionPartsToString(currentParts);
	for (var j = 0; j < tags.length; j++) {
		var candidate = tags[j].name;
		if (candidate && candidate != 'latest') {
			var candidateParts = splitVersion(candidate);
			if (candidateParts.length >= currentParts.length) {
				if (currentPartsAsString == versionPartsToString(candidateParts.slice(0, i + 1))) {
					var compareResult = compareVersions(versionParts, candidateParts, true);
					if (compareResult < 0) {
						foundHigherCandidate = true;
					}
				}
			}
		}
	}
	if (!foundHigherCandidate) {
		if (i == -1) {
			print('latest');
		} else {
			print(currentPartsAsString);
		}
		
	}
}
