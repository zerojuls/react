import { pxToRem } from '../../../../lib'

export interface IGridVariables {
  height: string
  width: string
  defaultItemSize: string
  gridGap: string
  padding: string
}

export default (): IGridVariables => ({
  height: '100%',
  width: '100%',
  defaultItemSize: pxToRem(50),
  gridGap: pxToRem(10),
  padding: pxToRem(10),
})
