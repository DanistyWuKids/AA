/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-cycle */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-mixed-operators */
/* eslint-disable arrow-parens */
/* eslint-disable operator-linebreak */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */

import React, {useEffect, useState} from 'react';
// import Array1DRenderer from '../Array1DRenderer/index';
import { motion, AnimateSharedLayout } from 'framer-motion';
import Array2DRenderer, { } from '../Array2DRenderer/index';
import styles from './Array1DRenderer.module.scss';
import { classes } from '../../common/util';
import { mode } from '../../../top/Settings';


let modename;
function switchmode(modetype = mode()) {
  switch (modetype) {
    case 1:
      modename = styles.array_1d_green;
      break;
    case 2:
      modename = styles.array_1d_blue;
      break;
    default:
      modename = styles.array_1d;
  }
  return modename;
}


class Array1DRenderer extends Array2DRenderer {
  constructor(props) {
    super(props);

    this.togglePan(true);
    this.toggleZoom(true);
  }



  renderData() {
    const { data, algo, customVal, depth } = this.props.data;
    console.log(data);

    const arrayMagnitudeScaleValue = 20; // value to scale an array e.g. so that the maximum item is 150px tall

    let longestRow = data.reduce((longestRow, row) => longestRow.length < row.length ? row : longestRow, []);
    let largestColumnValue = data[0].reduce((acc, curr) => (acc < curr.value ? curr.value : acc), 0);
    let scaleY = ((largest, columnValue) => columnValue / largest * arrayMagnitudeScaleValue).bind(null, largestColumnValue);
    if (!this.props.data.arrayItemMagnitudes) {
      scaleY = () => 0;
    }
    return (
    <motion.div
    animate={{ scale: this.zoom }}
    className={switchmode(mode())}
    >

        {/* Values */}
        {data.map((row, i) => (
                <div className={styles.row} key={i} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                {row.filter((col) => col.variables.includes('pivot')).map((col)=><div className={styles.pivotLine} style={{
                bottom: `max(var(--array-1d-minimum-height), ${this.toString(scaleY(col.value))}vh)`}}/>)}
            {row.map((col) => (
            <motion.div
                layout
                transition={{ duration: 0.6 }}
                style={{
                  height: `${this.toString(scaleY(col.value))}vh`,
                  display: 'flex',
                }}

                /* eslint-disable-next-line react/jsx-props-no-multi-spaces */
                className={classes(
                  styles.col,
                  col.faded && styles.faded,
                  col.selected && styles.selected,
                  col.patched && styles.patched,
                  col.sorted && styles.sorted,
                  col.style && col.style.backgroundStyle,
                )}
                key={col.key}
            >
               <motion.span layout="position" className={classes(
                 styles.value,
                 col.style && col.style.textStyle,
               )}>
                {this.toString(col.value)}
                </motion.span>

            </motion.div>
            ))}
        </div>
        ))}

<div>
        {/* Indexes */}
        <div className={styles.row} style={{ display: 'flex', justifyContent: 'space-between' }}>
        {longestRow.map((_, i) => {
          // if the graph instance is heapsort, then the array index starts from 1
          if (algo === 'heapsort') {
            i += 1;
          }
          return (
                    <div className={classes(styles.col, styles.index)} key={i}>
                    <span className={styles.value}>{i}</span>
                    </div>
          );
        })}
        </div>

        {/* Variable pointers */}
        {data.map(
          (row, i) => ( // variable pointer only working for 1D arrays
            <AnimateSharedLayout>
                <div layout className={styles.row} key={i} style={{minHeight: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>

                {row.map((col) => (
                    <div
                    className={classes(styles.col, styles.variables)}
                    key={`vars-${col.key}`}
                    >
                    {col.variables.map((v) => (
                        <motion.div
                        layoutId={v}
                        key={v}
                        className={styles.variable}
                        style={{ fontSize: v.length > 2 ? '12px' : null, color: 'green'}}
                        >
                        {v}
                        </motion.div>
                    ))}
                    </div>
                ))}
                </div>
            </AnimateSharedLayout>
          ),
        )}
        </div>
        <p style={{fontSize: '14px', color: 'grey'}}>{depth != undefined && customVal != undefined && customVal.length > 0 ? `Current stack depth: ${depth+1}` : ''}</p>
        <div style={{}}>
        {customVal != undefined ?
        (() => {
          let newA = [];
          for (let i=0;i<customVal.length;i++) {
            newA.push(<div style={{display: 'flex',
             justifyContent: 'space-between',
            margin: 'auto'}}>{customVal[i].map(val => { 
              return <div style={{
                transitionDuration: '0.1s',
                width: `calc(100%/${data[0].length})`,
                marginTop: '8px',
                height: '6px',
                backgroundColor: v(val) }}></div>})
          }
          </div>)
          }
          return newA;
          }
        )() : <div></div>}

        </div>
    </motion.div>
    );
  }
}

function v(a) {
  if(a == 0) {
    return 'rgba(0,1,1,0)'
  }
  if(a==1) {return 'red'}
  if(a==-1) {return 'rgba(0,0,0,0.2)'};
  if(a==-2) {return 'pink'}
}


export default Array1DRenderer;
