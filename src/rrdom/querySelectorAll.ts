import { RRNode, RRElement } from './tree-node';

export function querySelectorAll(selector: string, rootElement: RRNode) {
  let allMatchingElements: RRNode[] = [];

  const individualCSSQueries = splitSelectorBySubstring(selector, ',');

  individualCSSQueries.forEach(function (subSelector: string) {
    allMatchingElements = allMatchingElements.concat(
      findCSSQueryMatches(subSelector, rootElement),
    );
  });

  return allMatchingElements;
}

function findCSSQueryMatches(selector: string, rootElement: RRNode) {
  let previouslyMatchingElements = [rootElement],
    currentMatchingElements: RRNode[] = [];
  let directDescendantSelectors = splitSelectorBySubstring(selector, '>');

  directDescendantSelectors.forEach(function (directDescendantSelector, i) {
    const nestedSelectors = directDescendantSelector.split(' ');

    nestedSelectors.forEach(function (nestedSelector, j) {
      currentMatchingElements = [];

      if (i === 0) {
        searchDOMSubtreeOfEachPreviousMatch(
          nestedSelector,
          previouslyMatchingElements,
          currentMatchingElements,
        );
      } else {
        if (j === 0) {
          searchChildrenOfEachPreviousMatch(
            nestedSelector,
            previouslyMatchingElements,
            currentMatchingElements,
          );
        } else {
          searchDOMSubtreeOfEachPreviousMatch(
            nestedSelector,
            previouslyMatchingElements,
            currentMatchingElements,
          );
        }
      }

      previouslyMatchingElements = currentMatchingElements.slice();
    });
  });

  return currentMatchingElements;
}

function breadthFirstDOMTraversal(
  rootElement: RRNode,
  callback: (currentNode: RRNode) => void,
) {
  let unvisitedNodes = [],
    currentChild,
    currentNode;
  unvisitedNodes.push(rootElement);

  while (unvisitedNodes.length) {
    currentNode = unvisitedNodes.shift();
    if (currentNode === undefined) return;
    callback(currentNode);

    for (let i = 0; i < currentNode.childNodes.length; i++) {
      currentChild = currentNode.childNodes[i];

      if (!~unvisitedNodes.indexOf(currentChild)) {
        unvisitedNodes.push(currentChild);
      }
    }
  }
}

function matchesNonWhiteSpacedSelector(element: RRElement, selector: string) {
  if (!element.classList || typeof element.attributes.id === 'undefined')
    return false;

  const selectorParameters = selector
    .replace(/[^\w]/g, ' $&')
    .trim()
    .split(' ');

  return (
    selectorParameters.filter(function (selectorParameter) {
      return !matchesSelectorParameter(element, selectorParameter);
    }).length === 0
  );
}

function matchesSelectorParameter(element: RRElement, selector: string) {
  const selectorText = selector.slice(1);

  switch (selector[0]) {
    case '#':
      return element.attributes.id === selectorText;
      break;
    case '.':
      return ~[].slice.call(element.classList).indexOf(selectorText);
      break;
    default:
      return element.tagName === selector.toLowerCase();
  }
}

function searchChildrenOfEachPreviousMatch(
  nestedSelector: string,
  previouslyMatchingElements: RRNode[],
  currentMatchingElements: RRNode[],
) {
  previouslyMatchingElements.forEach(function (previousMatch) {
    for (let i = 0; i < previousMatch.childNodes.length; i++) {
      const childElement = previousMatch.childNodes[i];

      if (
        childElement instanceof RRElement &&
        matchesNonWhiteSpacedSelector(childElement, nestedSelector)
      ) {
        currentMatchingElements.push(childElement);
      }
    }
  });
}

function searchDOMSubtreeOfEachPreviousMatch(
  nestedSelector: string,
  previouslyMatchingElements: RRNode[],
  currentMatchingElements: RRNode[],
) {
  previouslyMatchingElements.forEach(function (previousMatch) {
    breadthFirstDOMTraversal(previousMatch, function (childElement: RRElement) {
      if (matchesNonWhiteSpacedSelector(childElement, nestedSelector)) {
        currentMatchingElements.push(childElement);
      }
    });
  });
}

function splitSelectorBySubstring(selector: string, subString: string) {
  return selector.split(subString).map(function (subSelector) {
    return subSelector.trim();
  });
}
