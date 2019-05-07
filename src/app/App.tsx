import * as React from 'react';
import { Layout, Menu, Breadcrumb, Form, Input, Icon, Affix, Tabs, Button, Slider } from 'antd';
import TreeView from './components/tree.view';
import { SliderValue } from 'antd/lib/slider';

const {SubMenu} = Menu;
const TabPane = Tabs.TabPane;

const { Header, Content, Footer, Sider } = Layout;

interface AppState {
  blendingModeEnabled: boolean;
}

interface IState{
  app: AppState;
  url: string,
  collapsed: boolean,
  validUrl: string
  opacity: any;
}

class App extends React.Component<any, IState>{


  constructor(props){
    super(props)

    this.state = {
      url: 'http://www.google.com',
      collapsed: false,
      validUrl: '',
      opacity: 0.5,
      app: {
        blendingModeEnabled: true
      }
    }
  }

  componentDidMount(){
    console.log(document.getElementById('view'))
    if(this.r){
      this.r.addEventListener('did-start-loading', (e) => {
       
        if(this.r.src !== this.state.url){

          const {
            setFieldsValue
          } = this.props.form;

          setFieldsValue({
            url: this.r.src
          })
        }
      });
      this.r.addEventListener('did-finish-load', (e) => {
        this.setState({
          validUrl: this.r.src
        })
      });
    }
  }

  parseUrl = (val) => {
    let https = val.slice(0, 8).toLowerCase();
    let http = val.slice(0, 7).toLowerCase();
    if (https === 'https://') {
      return val;
    } else if (http === 'http://') {
      return val;
    } else {

      return 'http://' + val;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const val = this.parseUrl(values.url);

        this.setState({url: val})
      }
    });
  }

  r: any;

  getValue = () => {
    if(this.r)
        return this.r.src
    return '';
  }

  renderBar(){

    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    // addonAfter={<Icon type="setting" />} 
    return (<Form  onSubmit={this.handleSubmit}>
               
                  <Form.Item
                    >
                      {getFieldDecorator('url', {
                        })(
                          <Input prefix={<Icon type="cloud" style={{ color: 'rgba(0,0,0,.25)'}} />} placeholder="Url"/>
                        )}
                  </Form.Item>
            </Form>)
  }

  getBlendingTab = () => {
    return (
      <Slider
              min={0}
              max={1}
              step={0.1}
              onChange={e => this.setState({opacity: e})}
              value={this.state.opacity}
              style={{minWidth: 100}}
            />)
  }

  render(){

    const {
      getFieldValue
    } = this.props.form;

    return ( <Layout style={{width:'100%', height: '100%'}}>
              
                <Header style={{ position: 'absolute', zIndex: 1, width: '80%', height: '50px', padding:'10px' }}>
                  
                  {this.renderBar()}
                </Header>

                <div className="card-container">
                  <Tabs tabPosition='top' className='tabs-container' type="card">
                    <TabPane className={`main-container ${this.state.app.blendingModeEnabled? 'blending': ''}`} forceRender tab={this.state.app.blendingModeEnabled? this.getBlendingTab(): 'Browser'} key="1">
                          {this.state.app.blendingModeEnabled && <TreeView style={{opacity: 1 - this.state.opacity}} url={this.state.validUrl} />}
                          <webview ref={e => this.r = e} style={{width:'100%', height: '100%', opacity: this.state.opacity}}  src={this.state.url} />
                    </TabPane>
                    { !this.state.app.blendingModeEnabled && <TabPane forceRender tab="Art" key="2"><TreeView url={this.state.validUrl} /></TabPane>}
                  </Tabs>
                </div>
                
              </Layout>);
  }
}

export default Form.create()(App);
