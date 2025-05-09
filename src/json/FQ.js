import { mcp, sl, lwt } from '@/json/index'

const strokeColor = '#5679ea'
// const strokeColor = '#33eaff'
const fillColor = '#5679ea'
// const fillColor = '#33eaff'
const strokeStyle = 'solid'

export const FQ = {
  center: { lng: 107.46290225830913, lat: 26.808498502453208 },
  areas: [
    {
      name: '区块一',
      alias: '区块一：马场坪工业园区',
      path: mcp,
      strokeColor,
      fillColor,
      strokeStyle,
      polygon: null,
      showPrism: true,
      showTip: true,
    },
    {
      name: '区块二',
      alias: '区块二：双龙工业园区（双龙组团）',
      path: sl,
      strokeColor,
      fillColor,
      strokeStyle,
      polygon: null,
      showPrism: true,
      showTip: true,
    },
    {
      name: '区块三',
      alias: '区块三：双龙工业园区（罗尾塘组团）',
      path: lwt,
      strokeColor,
      fillColor,
      strokeStyle,
      polygon: null,
      showPrism: true,
      showTip: true,
    },
  ],
}
