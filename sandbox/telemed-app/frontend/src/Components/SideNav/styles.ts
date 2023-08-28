const styles = {
  link: {
    height: '30px',
    paddingY: 0.5,
    paddingX: 1,
    textTransform: 'capitalize',
    fontSize: 14,
    '&:hover': {
      backgroundColor: '#F7F7F7',
      // color: '#fff',
      '& .MuiListItemIcon-root, .MuiSvgIcon-root, .MuiListItemText-root': {
        // color: '#fff',
      },
    },
  },
  linkListActive: {backgroundColor: '#F7F7F7'},
  linkTextActive: {
    fontWeight: 'bold !important',

    fontSize: '14px',
  },
  listItemIcon: {minWidth: 30},
  linkItemIconActive: {
    color: `secondary.main`,
  },
  divider: {marginTop: 1, marginBottom: 1, height: 2},
  title: {paddingX: 1, textTransform: 'uppercase', fontWeight: 'bold'},
};

export default styles;
