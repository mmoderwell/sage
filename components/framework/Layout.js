const styles = {
	color: '#000',
	fontFamily: 'Hack',
	letterSpacing: '.01em',
	margin: '0 auto',
	maxWidth: '112.0rem',
	padding: '0 2.0rem',
	position: 'relative',
}

const Layout = (props) => (
	<div style={styles}>
        {props.children}
    </div>
)

export default Layout