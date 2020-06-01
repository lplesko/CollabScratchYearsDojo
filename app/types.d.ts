interface StatisticsResponse {
   dummy: "1" | string,
   year: "2016" | "2017" | "2018" | "2019" | string,
   value: string
 } 
  
interface ChartData {
  row: number,
  col: number,
  value: string
}

interface CellHighlight {
  row: number,
  col: number
}
