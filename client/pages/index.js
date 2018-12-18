// This is the Link API
import Link from 'next/link'
import Head from 'next/head';
import Layout from '../components/framework/Layout'
import Header from '../components/Header'

const Index = (props) => (
	<Layout>
		<Head>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/font-hack/2.020/css/hack.min.css" />
			<link href="https://fonts.googleapis.com/css?family=Leckerli+One" rel="stylesheet" />
			<link rel="stylesheet" type="text/css" href="/static/modstyle.css" />
		</Head>

		<Header />

  	</Layout>
)

export default Index