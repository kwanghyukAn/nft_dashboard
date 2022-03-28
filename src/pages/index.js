import React, { Component } from "react";
import Head from "next/head";
import { Box, Container, Grid } from "@mui/material";
import { Budget } from "../components/dashboard/budget";
import { LatestOrders } from "../components/dashboard/latest-orders";
import { TasksProgress } from "../components/dashboard/tasks-progress";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { TotalProfit } from "../components/dashboard/total-profit";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import { DashboardLayout } from "../components/dashboard-layout";
import { ThirtyFpsSelect } from "@mui/icons-material";

const nft_list = [
  "https://api.opensea.io/api/v1/collection/the-meta-kongz",
  "https://api.opensea.io/api/v1/collection/syltare-dawn-of-east",
  "https://api.opensea.io/api/v1/collection/sunmiya-club-official",
  "https://api.opensea.io/api/v1/collection/angry-polar-bears",
];

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_eth: 0,
      nft_name: [],
      nft_result: [],
      current_nft_price: [],
    };
  }

  async componentDidMount() {
    await this.get_eth();

    for (let i = 0; i < nft_list.length; i++) {
      await this.get_info(i);
    }

    this.forceUpdate();
  }

  async get_eth() {
    try {
      const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-ETH");
      const ret = await res.json();
      this.setState({ current_eth: ret[0].trade_price });
    } catch (e) {
      console.log(e);
    }
  }

  async get_info(i) {
    try {
      const res = await fetch(nft_list[i]);
      const ret = await res.json();
      await this.state.nft_name.push(ret.collection.name);
      await this.state.nft_result.push(ret.collection.stats.floor_price);
      await this.state.current_nft_price.push(
        parseInt(ret.collection.stats.floor_price * this.state.current_eth).toLocaleString()
      );
      console.log(this.state.nft_name);
      console.log(this.state.current_nft_price);
      // await this.setState({
      //   nft_name: [this.state.nft_name, ret.collection.name],
      //   nft_result: [this.state.nft_result, ret.collection.stats.floor_price],
      //   current_nft_price: [
      //     this.state.current_nft_price,
      //     parseInt(ret.collection.stats.floor_price * this.state.current_eth).toLocaleString(),
      //   ],
      // });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <>
        <Head>
          <title>Dashboard | KHAN</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              {this.state.current_nft_price.map((name, index) => (
                <Grid item xl={3} lg={3} sm={6} xs={12} key={index}>
                  <TotalProfit
                    name={this.state.nft_name[index]}
                    price={this.state.current_nft_price[index]}
                  />
                </Grid>
              ))}
              <Grid item lg={12} md={12} xl={9} xs={12}>
                <LatestOrders />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </>
    );
  }
}

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
