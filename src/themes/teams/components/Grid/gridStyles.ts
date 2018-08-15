import { IGridVariables } from './gridVariables'
import { IComponentPartStylesInput, IProps, ICSSInJSStyle } from '../../../../../types/theme'

const getCSSTemplateValue = (template: string | number): string => {
  const templateAsNumber = Number(template)

  return !isNaN(templateAsNumber) && templateAsNumber > 0
    ? `repeat(${template}, 1fr)`
    : String(template)
}

const getSizeObjFromCssSizeProp = (size: string): { height: string; width: string } => {
  if (typeof size !== 'string' || !size) {
    return { height: undefined, width: undefined }
  }

  const [height, width = height] = size.split(/[ ,]+/)
  return { height, width }
}

const getGridCssStylesFromSize = (size: string): { grid: string } => {
  const { height, width } = getSizeObjFromCssSizeProp(size)
  return { grid: `auto-flow ${height} / repeat(auto-fill, ${width})` }
}

const gridStyles: IComponentPartStylesInput = {
  root: ({
    props,
    variables: { height, width, defaultItemSize, gridGap, padding },
  }: {
    props: IProps
    variables: IGridVariables
  }): ICSSInJSStyle => {
    const { columns, rows } = props
    const itemSize = props.itemSize || (!rows && !columns && defaultItemSize)

    const styles = {
      height,
      width,
      padding,
      gridGap,
      display: 'grid',
      justifyContent: 'space-evenly',
      gridAutoFlow: rows && !columns && 'column',

      ...(rows && { gridTemplateRows: getCSSTemplateValue(rows) }),
      ...(columns && { gridTemplateColumns: getCSSTemplateValue(columns) }),
      ...(itemSize && getGridCssStylesFromSize(itemSize)),
    }

    return styles
  },
}

export default gridStyles
