import { Theme, emphasize } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useBreadCrumbsStyles = makeStyles((theme: Theme) => {
  const backgroundColor = theme.palette?.type === 'light' ? theme?.palette?.grey[200] : theme?.palette?.grey[700];
  return {
    root: {
      '& .MuiChip-root': {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        '&:hover, &:focus': {
          backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
          boxShadow: theme.shadows[1],
          backgroundColor: emphasize(backgroundColor, 0.12),
        },
        '& .MuiChip-label': {
          textTransform: 'capitalize',
        },
      },
    },
  };
});

export default useBreadCrumbsStyles;
