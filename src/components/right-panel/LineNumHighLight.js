/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-loop-func */
/* eslint-disable react/button-has-type */
/* eslint-disable dot-notation */
/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DescriptionIcon from '@material-ui/icons/Description';
import { GlobalContext } from '../../context/GlobalState';
import { GlobalActions } from '../../context/actions';
import '../../styles/LineNumHighLight.scss';

function blockContainsBookmark(algorithm, block) {
  for (const line of algorithm.pseudocode[block]) {
    if (line.bookmark === algorithm.bookmark
        || (line.ref && blockContainsBookmark(algorithm, line.ref, algorithm.bookmark))) {
      return true;
    }
  }
  return false;
}

function pseudocodeBlock(algorithm, dispatch, blockName, lineNum) {
  let i = lineNum;
  let codeLines = [];
  for (const line of algorithm.pseudocode[blockName]) {
    i += 1;
    let button = null;
    if (algorithm.collapse[blockName] && line.lineExplanButton !== undefined) {
      button = <button className="line-explanation-button" onClick={() => { dispatch(GlobalActions.LINE_EXPLANATION, line.lineExplanButton.id); }}>
                <DescriptionIcon style={{ fontSize: 10 }} />
               </button>;
    }
    if (line.ref) {
      codeLines.push(
        <p
          key={i}
          className={(!algorithm.collapse[line.ref]
            && blockContainsBookmark(algorithm, line.ref)) ? 'active' : ''}
          role="presentation"
        >
          <span>{i}</span>
          <span>
            <button
              className="expand-collopse-button"
              onClick={() => {
                dispatch(GlobalActions.COLLAPSE, line.ref);
              }}
            >
              {algorithm.collapse[line.ref]
                ? <ExpandMoreIcon style={{ fontSize: 10 }} />
                : <ChevronRightIcon style={{ fontSize: 10 }} />}
            </button>
          </span>
          <span>{line.code}</span>
          <span>{button}</span>
        </p>,
      );
      if (button != null && line.lineExplanButton.state) {
        codeLines.push(
          <p>
            <span> </span>
            <span>{line.explanation}</span>
          </p>,
        );
      }
      if (algorithm.collapse[line.ref]) {
        const subblock = pseudocodeBlock(algorithm, dispatch, line.ref, i);
        i = subblock.index;
        codeLines = codeLines.concat(subblock.cl);
      }
    } else {
      codeLines.push(
        <p
          key={i}
          className={algorithm.bookmark === line.bookmark ? 'active' : ''}
          role="presentation"
        >
          <span>{i}</span>
          <span>{line.code}</span>
          <span>{button}</span>
        </p>,
      );
      if (button != null && line.lineExplanButton.state) {
        codeLines.push(
          <p>
            <span> </span>
            <span>{line.explanation}</span>
          </p>,
        );
      }
    }
  }
  return { index: i, cl: codeLines };
}

const LineNumHighLight = () => {
  const { algorithm, dispatch } = useContext(GlobalContext);
  return (
    <div className="line-light">
      <div className="code-container">
        {pseudocodeBlock(algorithm, dispatch, 'Main', 0).cl}
      </div>
    </div>
  );
};

export default LineNumHighLight;
