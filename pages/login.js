import Layout from '../components/framework/Layout'
import Row from '../components/framework/Row'
import Column from '../components/framework/Column'
import Pop from '../components/Pop'

export default (props) => (
	<Layout>
		<Row>
			<Column size="10"></Column>
			<Column size="80">
				<Pop maxwidth="50">

				</Pop>
			</Column>
			<Column size="10"></Column>
		</Row>
	</Layout>
)