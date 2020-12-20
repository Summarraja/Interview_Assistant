import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './SideNav.css';

const SideNavigation = () => {
    const tog = () => {
        return false;
    }

    const [expanded, setExpanded] = useState(false);
    return (
        <React.Fragment className='sidenav'>
        <Route render={
            ({ location, history }) => (
                <SideNav
                    onSelect={
                        (selected) => {
                            const to = '/' + selected;
                            if (location.pathname !== to) {
                                history.push(to);
                                setExpanded(false);
                            }
                        }
                    }
                    expanded={expanded}
                >
                    <SideNav.Toggle onClick={() => setExpanded(expanded ? false : true)} />
                    <SideNav.Nav defaultSelected="home" >
                        <NavItem eventKey="home" >
                            <NavIcon >
                                <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText >Home </NavText>
                        </NavItem>
                        <NavItem eventKey="chat" >
                            <NavIcon >
                                <i className="fa fa-envelope-o" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText >Inbox </NavText>
                        </NavItem>
                        <NavItem eventKey="notifications" >
                            <NavIcon >
                                <i className="fa fa-bell" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText >Notifications </NavText> </NavItem>
                        <NavItem eventKey="interviews/new" >
                            <NavIcon >
                                <i className="fa fa-archive" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText >Interviews </NavText>
                        </NavItem>
                        <NavItem eventKey="settings" >
                            <NavIcon >
                                <i className="fa fa-fw fa-cogs" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText >Settings </NavText>
                        </NavItem>
                        <NavItem eventKey="reports" >
                            <NavIcon >
                                <i className="fa fa-fw fa-list-alt" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText >Reports </NavText>
                        </NavItem>
                        <NavItem eventKey="charts" >
                            <NavIcon >
                                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                            </NavIcon>
                            <NavText >Charts </NavText>
                            <NavItem eventKey="charts/linechart" >
                                <NavText >Line Chart </NavText>
                            </NavItem> <NavItem eventKey="charts/barchart" >
                                <NavText >Bar Chart </NavText>
                            </NavItem>
                        </NavItem>
                    </SideNav.Nav>
                </SideNav>
            )
        }
        />
        </React.Fragment>
        );


}
export default SideNavigation;