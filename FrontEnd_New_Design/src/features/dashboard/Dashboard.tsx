import React, { ReactNode, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Progress,
  Radio,
  Row,
  Timeline,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import EChart from "../../Components/CustomComponents/ECharts/ECharts";
import LineChart from "../../Components/CustomComponents/ECharts/LineChart";
import { MenuUnfoldOutlined, ToTopOutlined } from "@ant-design/icons";
import Paragraph from "antd/es/typography/Paragraph";
import bidService from "../../services/leadsConnectService";
import { log } from "console";
import { useDispatch, useSelector } from "react-redux";
import { leadsConnectSelector } from "../../Selectors/leadsConnectSelector";
import { dashboardLeadsConnectSelector } from "../../Selectors/dashboardSelector";
interface Props {
  loading: (progress: number, value: boolean) => void;
}

const Dashboard = (props: Props) => {
  const { loading } = props;
  const { Title, Text } = Typography;
  const onChange = (e: any) => console.log(`radio checked:${e.target.value}`);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<any>(bidService.fetchjobscalculationslist());
  }, []);

  const jobscalculationsData = useSelector(dashboardLeadsConnectSelector);
  const list = jobscalculationsData
    ? jobscalculationsData.map(
        (dataItem: {
          employeeName: any;
          totalLeads: any;
          totalApplied: any;
          totalHired: any;
          totalConnectUsed: any;
        }) => ({
          img: "ava1",
          Title: "Soft UI Shopify Version",
          bud: "$14,000",
          employeeName: dataItem?.employeeName,
          totalLeads: dataItem?.totalLeads,
          totalApplied: dataItem?.totalApplied,
          totalHired: dataItem?.totalHired,
          totalConnectUsed: dataItem?.totalConnectUsed,
          progress: <Progress percent={60} size="small" />,
          member: (
            <div className="avatar-group mt-2">
              <Tooltip placement="bottom" title="Ryan Tompson">
                <img className="tootip-img" src={"team1"} alt="" />
              </Tooltip>
              <Tooltip placement="bottom" title="Romina Hadid">
                <img className="tootip-img" src={"team2"} alt="" />
              </Tooltip>
              <Tooltip placement="bottom" title="Alexander Smith">
                <img className="tootip-img" src={"team3"} alt="" />
              </Tooltip>
              <Tooltip placement="bottom" title="Jessica Doe">
                <img className="tootip-img" src={"team4"} alt="" />
              </Tooltip>
            </div>
          ),
        })
      )
    : [];
  /*   const list = [
    {
      img: "ava1",
      Title: "Soft UI Shopify Version",
      bud: "$14,000",
      progress: <Progress percent={60} size="small" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={"team1"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={"team2"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Alexander Smith">
            <img className="tootip-img" src={"team3"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Jessica Doe">
            <img className="tootip-img" src={"team4"} alt="" />
          </Tooltip>
        </div>
      ),
    },
    {
      img: "ava2",
      Title: "Progress Track",
      bud: "$3,000",
      progress: <Progress percent={10} size="small" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={"team1"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={"team2"} alt="" />
          </Tooltip>
        </div>
      ),
    },
    {
      img: "ava3",
      Title: "Fix Platform Errors",
      bud: "Not Set",
      progress: <Progress percent={100} size="small" status="active" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={"team1"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={"team1"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Alexander Smith">
            <img className="tootip-img" src={"team3"} alt="" />
          </Tooltip>
        </div>
      ),
    },
    {
      img: "ava4",
      Title: "Launch new Mobile App",
      bud: "$20,600",
      progress: <Progress percent={100} size="small" status="active" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={"team1"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={"team2"} alt="" />
          </Tooltip>
        </div>
      ),
    },
    {
      img: "ava5",
      Title: "Add the New Landing Page",
      bud: "$4,000",
      progress: <Progress percent={80} size="small" />,
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={"team1"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={"team2"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Alexander Smith">
            <img className="tootip-img" src={"team3"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Jessica Doe">
            <img className="tootip-img" src={"team4"} alt="" />
          </Tooltip>
        </div>
      ),
    },

    {
      img: "ava6",
      Title: "Redesign Online Store",
      bud: "$2,000",
      progress: (
        <Progress
          percent={100}
          size="small"
          status="exception"
          format={() => "Cancel"}
        />
      ),
      member: (
        <div className="avatar-group mt-2">
          <Tooltip placement="bottom" title="Ryan Tompson">
            <img className="tootip-img" src={"team1"} alt="" />
          </Tooltip>
          <Tooltip placement="bottom" title="Romina Hadid">
            <img className="tootip-img" src={"team2"} alt="" />
          </Tooltip>
        </div>
      ),
    },
  ]; */

  useEffect(() => {
    loading(100, false);
  }, []);

  return (
    <>
      <div className="layout-content">
        {/* <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.today}</span>
                      <Title level={3}>
                        {c.title} <small className={c.bnb}>{c.persent}</small>
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row> */}

        {/* <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <EChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
            <Card bordered={false} className="criclebox h-full">
              <LineChart />
            </Card>
          </Col>
        </Row> */}

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <div className="project-ant">
                <div>
                  <Title level={5}>Job's This Week</Title>
                </div>
                {/* <div className="ant-filtertabs">
                  <div className="antd-pro-pages-dashboard-analysis-style-salesExtra">
                    <Radio.Group onChange={onChange} defaultValue="a">
                      <Radio.Button value="a">ALL</Radio.Button>
                      <Radio.Button value="b">ONLINE</Radio.Button>
                      <Radio.Button value="c">STORES</Radio.Button>
                    </Radio.Group>
                  </div>
                </div> */}
              </div>
              <div className="ant-list-box table-responsive">
                <table className="width-100">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Total Leads</th>
                      <th>Total Applied</th>
                      <th>Total Hired</th>
                      <th>Total Connect Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(
                      (
                        d: {
                          totalHired: ReactNode;
                          totalLeads: ReactNode;
                          img: string | undefined;
                          employeeName:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                          member:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                          totalApplied:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                          totalConnectUsed:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined;
                        },
                        index: React.Key | null | undefined
                      ) => (
                        <tr key={index}>
                          <td>
                            <h6>
                              <img
                                src={d.img}
                                alt=""
                                className="avatar-sm mr-10"
                              />{" "}
                              {d.employeeName}
                            </h6>
                          </td>
                          <td>
                            <div className="percent-progress">
                              {d.totalLeads}
                            </div>
                          </td>
                          <td>
                            <span className="text-xs font-weight-bold">
                              {d.totalApplied}{" "}
                            </span>
                          </td>
                          <td>
                            <div className="percent-progress">
                              {d.totalHired}
                            </div>
                          </td>
                          <td>
                            <div className="percent-progress">
                              {d.totalConnectUsed}
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {/* <div className="uploadfile shadow-none">
                <Upload {...uploadProps}>
                  <Button
                    type="dashed"
                    className="ant-full-box"
                    icon={<ToTopOutlined />}
                  >
                    <span className="click">Click to Upload</span>
                  </Button>
                </Upload>
              </div> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-24">
            {/* <Card bordered={false} className="criclebox h-full">
              <div className="timeline-box">
                <Title level={5}>Orders History</Title>
                <Paragraph className="lastweek" style={{ marginBottom: 24 }}>
                  this month <span className="bnb2">20%</span>
                </Paragraph> */}

            {/* <Timeline
                  pending="Recording..."
                  className="timelinelist"
                  reverse={reverse}
                >
                  {timelineList.map((t, index) => (
                    <Timeline.Item color={t.color} key={index}>
                      <Title level={5}>{t.title}</Title>
                      <Text>{t.time}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline> */}
            {/* <Button
                  type="primary"
                  className="width-100"
                  onClick={() => setReverse(!reverse)}
                >
                  {<MenuUnfoldOutlined />} REVERSE
                </Button>
              </div>
            </Card> */}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
function dispatch<T>(arg0: (dispatch: import("redux").Dispatch<any>) => void) {
  throw new Error("Function not implemented.");
}
