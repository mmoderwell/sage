import Row from '../components/framework/Row'
import Column from '../components/framework/Column'

const styles = {
	sage: {
		padding: '6% 0',
	    fontFamily: 'Leckerli One',
	    letterSpacing: '.1em',
	},
	personal: {
		textAlign: 'right',
	}
}

const Header = () => (
    <Row>
	    <Column size="60">
	        <h1 style={styles.sage}>Sage</h1>
	    </Column>
	    <Column size="40">
	    	<div style={styles.personal}>
		        <p>Made by Matt Moderwell</p>
		        <a href="https://mmoderwell.com" title="mmoderwell.com">mmoderwell.com</a><br></br>
		        <a href="https://github.com/mmoderwell/sage" title="github.com/mmoderwell/sage">github.com/mmoderwell/sage</a>
	        </div>
	    </Column>
	</Row>
)

export default Header