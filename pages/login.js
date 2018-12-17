import React from 'react';
import Head from 'next/head';

import Layout from '../components/framework/Layout';
import Row from '../components/framework/Row';
import Column from '../components/framework/Column';

import Pop from '../components/Pop';
import Header from '../components/Header';
import Button from '../components/Button';

import '../components/form.css'

const styles = {
}

class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: '',
		};

		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleUsernameChange(event) {
    	this.setState({username: event.target.value});
  	}
  	handlePasswordChange(event) {
    	this.setState({password: event.target.value});
  	}
  	handleSubmit(event) {
	    alert('A name was submitted: ' + this.state.username + ' ' + this.state.password);
	    event.preventDefault();
  	}

  	render() {
  		return (
			<Layout>
				<Head>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/font-hack/2.020/css/hack.min.css" />
					<link href="https://fonts.googleapis.com/css?family=Leckerli+One" rel="stylesheet" />
					<link rel="stylesheet" type="text/css" href="/static/modstyle.css" />
				</Head>
				<Header />
				<Row>
					<Column size="10"></Column>
					<Column size="80">
						<Pop maxwidth="70">
							<p style={styles.heading}>Log in to Sage
		                        <br></br>or <a href="" title="create an account">create an account</a></p>
		                    <p className="error">No errors</p>

                    		<form id="login_form" name="login_form">
                       			 <div className="form-group">
	                            	<input value={this.state.username} onChange={this.handleUsernameChange} type="text" required="required" autoComplete="username" />
	                            	<label className="control-label">username</label><i className="bar"></i>
	                        	</div>
                        		<div className="form-group">
		                            <input value={this.state.password} onChange={this.handlePasswordChange} type="password" required="required" autoComplete="current-password" />
		                            <label className="control-label">password</label><i className="bar"></i>
                        		</div>
                        		<button onClick={this.handleSubmit} type="button" className="button"></button>
                    		</form>
						</Pop>
					</Column>
					<Column size="10"></Column>
				</Row>
			</Layout>
		)
 	}
}

export default Login