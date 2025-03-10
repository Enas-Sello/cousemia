// MUI Imports
import Grid from '@mui/material/Grid2'

// Components Imports
import CongratulationsJohn from '@/views/ecommerce/dashborad/CongratulationsJohn'
import StatisticsCard from '@/views/ecommerce/dashborad/StatisticsCard'
import LineChartProfit from '@/views/ecommerce/dashborad/LineChartProfit'
import RadialBarChart from '@/views/ecommerce/dashborad/RadialBarChart'
import DonutChartGeneratedLeads from '@/views/ecommerce/dashborad/DonutChartGeneratedLeads'
import RevenueReport from '@/views/ecommerce/dashborad/RevenueReport'
import BrowserStates from '@/views/ecommerce/dashborad/BrowserStates'
import Transactions from '@/views/ecommerce/dashborad/Transactions'

const EcommerceDashboard = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 4 }}>
        <CongratulationsJohn />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <StatisticsCard />
      </Grid>
      <Grid size={{ xs: 12, xl: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6, md: 3, xl: 6 }}>
            <LineChartProfit />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3, xl: 6 }}>
            <RadialBarChart />
          </Grid>
          <Grid size={{ xs: 12, md: 6, xl: 12 }}>
            <DonutChartGeneratedLeads />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, xl: 8 }}>{<RevenueReport />}</Grid>
      {/* ............. */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <BrowserStates />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Transactions />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>{/* <Orders /> */}</Grid>
      {/* ........... */}
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>{/* <Transactions /> */}</Grid>
      <Grid size={{ xs: 12, lg: 8 }}>{/* <InvoiceListTable invoiceData={invoiceData} /> */}</Grid>
    </Grid>
  )
}

export default EcommerceDashboard
