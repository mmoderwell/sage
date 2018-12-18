import React from 'react';
import Head from 'next/head';
import 'isomorphic-unfetch';

import Layout from '../components/framework/Layout';
import Row from '../components/framework/Row';
import Column from '../components/framework/Column';

import Pop from '../components/Pop';
import Header from '../components/Header';
import Button from '../components/Button';

import '../static/form.css'

const styles = {
	error: {
		opacity: '0',
	    fontSize: '1.3rem',
	    color: '#d9534f',
	    WebkitTransition: 'all 0.25s ease',
	    transition: 'all 0.25s ease',
	}
}

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		};

		this.handleInputChange = this.handleInputChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleInputChange(event) {
	    const target = event.target;
	    const value = target.value;
	    const name = target.name;

	    this.setState({
	      [name]: value
	    });
  	}
  	handleSubmit(event) {
  		const data = {
  			username: this.state.username,
  			password: this.state.username
  		}
  		fetch('/login', {
	        method: "POST",
	        credentials: "same-origin",
	        headers: {
	            "Content-Type": "application/json; charset=utf-8",
	        },
	        redirect: "follow",
	        body: JSON.stringify(data),
  		}).then(r => r.json())
			.then( data => {
				console.log(data);
			});
	    alert('A name was submitted: ' + this.state.username + ' ' + this.state.password);
	    event.preventDefault();
  	}

  	render() {
  		return (
			<Layout>
				<Head>
					<meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport" />
					<meta content="" name="description"/>
					<meta content="Matt Moderwell" name="author"/>
					<meta name="mobile-web-app-capable" content="yes"/>
					<meta name="theme-color" content="#000"/>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/font-hack/2.020/css/hack.min.css" />
					<link href="https://fonts.googleapis.com/css?family=Leckerli+One" rel="stylesheet" />
					<link rel="stylesheet" type="text/css" href="/modstyle.css" />
				</Head>
				<Header />
				<Row>
					<Column size="10"></Column>
					<Column size="80">
						<Pop maxwidth="70">
							<p style={styles.heading}>Log in to Sage
		                        <br></br>or <a href="" title="create an account">create an account</a></p>
		                    <p style={styles.error}>No errors</p>

                    		<form id="login_form" name="login_form">
                       			 <div className="form-group">
	                            	<input value={this.state.username} onChange={this.handleInputChange} name="username" type="text" required="required" autoComplete="username" />
	                            	<label className="control-label">username</label><i className="bar"></i>
	                        	</div>
                        		<div className="form-group">
		                            <input value={this.state.password} onChange={this.handleInputChange} name="password" type="password" required="required" autoComplete="current-password" />
		                            <label className="control-label">password</label><i className="bar"></i>
                        		</div>
                        		<button onClick={this.handleSubmit} type="button" className="button"></button>
                    		</form>
						</Pop>
					</Column>
					<Column size="10"></Column>
				</Row>
				<style jsx>{`
					a {
					    color: #797979;
					}
					a:focus, a:hover {
					    color: #606c76;
					}
					.form-group {
					    position: relative;
					    margin-top: 1.25rem;
					    margin-bottom: 1.25rem;
					}
					.form-group input {
					    height: 3rem;
					}
					.form-group .control-label {
					    position: absolute;
					    top: 2.5rem;
					    pointer-events: none;
					    color: #bbb;
					    font-size: 1rem;
					    font-weight: normal;
					    -webkit-transition: all 0.28s ease;
					    transition: all 0.28s ease;
					}
					.form-group .bar {
					    position: relative;
					    border-bottom: 0.12rem solid #999;
					    display: block;
					}
					.form-group .bar::before {
					    content: '';
					    height: 0.2rem;
					    width: 0;
					    left: 50%;
					    bottom: -0.1rem;
					    position: absolute;
					    background: #566b95;
					    -webkit-transition: left 0.28s ease, width 0.28s ease;
					    transition: left 0.28s ease, width 0.28s ease;
					    z-index: 2;
					}
					@-webkit-keyframes autofill {
					    to {
					        color: #666;
					        background: transparent;
					    }
					}
					input:-webkit-autofill {
					    -webkit-animation-name: autofill;
					    -webkit-animation-fill-mode: both;
					}
					.form-group input{
						font-size: 1rem;
					    display: block;
					    background: none;
					    padding: 1.125rem 0.125rem 0.0625rem;
					    border-width: 0;
					    border-color: transparent;
					    line-height: 1;
					    width: 100%;
					    color: transparent;
					    -webkit-transition: all 0.28s ease;
					    transition: all 0.28s ease;
					    box-shadow: none;
					}
					.form-group input:focus, .form-group input:valid, .form-group input.has-value {
						color: #333;
					}
					.form-group input:focus~.control-label, .form-group input:valid~.control-label, .form-group input.has-value~.control-label  {
					    font-size: 1rem;
					    color: gray;
					    top: 0rem;
					    left: 0;
					}
					.form-group input:focus, .form-group textarea:focus {
					    outline: none;
					}
					.form-group input:focus~.control-label, .form-group textarea:focus~.control-label {
					    color: #566b95;
					}
					.form-group input:focus~.bar::before, .form-group textarea:focus~.bar::before {
					    width: 100%;
					    left: 0;
					}
					.has-error .legend.legend, .has-error.form-group .control-label.control-label {
					    color: #d9534f;
					}
					.error {
					    opacity: 0;
					    font-size: 1.3rem;
					    color: #d9534f;
					    -webkit-transition: all 0.25s ease;
					    transition: all 0.25s ease;
					}
					.has-error {
					    color: #d9534f;
					}
					.has-error .bar::before {
					    background: #d9534f;
					    left: 0;
					    width: 100%;
					}

					/*------------------Button Styles------------------*/

					button {
					    outline: none;
					    height: 40px;
					    text-align: center;
					    width: 130px;
					    border-radius: 40px;
					    background: #f7fbff;
					    border: 2px solid #566b95;
					    color: #566b95;
					    letter-spacing: 1px;
					    font-family: 'Hack', monospace;
					    font-size: 12px;
					    font-weight: bold;
					    cursor: pointer;
					    -webkit-transition: all 0.25s ease;
					    transition: all 0.25s ease;
					}
					button:hover {
					    border-color: #566b95;
					    color: white;
					    background: #566b95;
					}
					button:active {
					    letter-spacing: 2px;
					}
					button:focus {
					    background: #cee7ff;
					    border: 2px solid #566b95;
					    color: #566b95;
					}
					.onclick {
					    padding: 0;
					    width: 40px;
					    border-color: #bbb;
					    border-width: 3px;
					    font-size: 0;
					    border-left-color: #566b95;
					    -webkit-animation: rotating 2s 0.25s linear infinite;
					    animation: rotating 2s 0.25s linear infinite;
					}
					.onclick:after {
					    content: "";
					}
					.onclick:focus {
					    border: 2px solid #bbb;
					    color: #566b95;
					    border-left-color: #566b95;
					}
					.validate {
					    font-size: 13px;
					    color: white;
					    background: #566b95;
					}
					.validate:after {
					    font-family: 'FontAwesome';
					    content: "\f00c";
					}
					@-webkit-keyframes rotating {
					    from {
					        -webkit-transform: rotate(0deg);
					        transform: rotate(0deg);
					    }
					    to {
					        -webkit-transform: rotate(360deg);
					        transform: rotate(360deg);
					    }
					}
					@keyframes rotating {
					    from {
					        -webkit-transform: rotate(0deg);
					        transform: rotate(0deg);
					    }
					    to {
					        -webkit-transform: rotate(360deg);
					        transform: rotate(360deg);
					    }
					}

					button:after {
					    content: "LOGIN";
					}
				`}</style>
			</Layout>
		)
 	}
}

export default Login