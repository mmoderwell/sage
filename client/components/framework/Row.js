const styles = {
	display: 'flex',
	flexDirection: 'row',
    marginLeft: '0',
    maxWidth: '100%',
    width: '100%',
}

const Row = (props) => (
	<div style={styles}>
        {props.children}
    </div>
)

export default Row