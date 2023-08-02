import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from 'react';
import {Link, Location} from 'react-router-dom';
import {SideNavConfig, SideNavLinkTitle} from './sideNavConfig';
import styles from './styles';

const isChildOf = (child: string, parent: string) => child.indexOf(parent) === 0;

const NestedNavLink = ({
  link,
  children,
  // isLinkActive,
  icon,
  label,
  location,
}: SideNavLinkTitle & {location: Location}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleCollapse = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (children?.length && isChildOf(location.pathname, link)) {
      setIsOpen(true);
    }
  }, [children?.length, link, location.pathname]);

  return (
    <>
      <ListItem
        component={link ? Link : 'li'}
        to={link}
        onClick={toggleCollapse}
        sx={{
          ...styles.link,
        }}
      >
        {icon && (
          <ListItemIcon sx={{...styles.listItemIcon, ...(isOpen && styles.linkItemIconActive)}}>{icon}</ListItemIcon>
        )}
        <ListItemText primary={label} disableTypography />
        {isOpen ? <ExpandLessIcon sx={{...(isOpen && styles.linkItemIconActive)}} /> : <ExpandMoreIcon />}
      </ListItem>

      {children && (
        <Collapse component="li" in={isOpen} timeout="auto" unmountOnExit sx={{paddingLeft: 3}}>
          <List component="ul" disablePadding>
            {children.map((childrenLink, index) =>
              !childrenLink.visible ? null : <SideNavLink key={index} location={location} {...childrenLink} />,
            )}
          </List>
        </Collapse>
      )}
    </>
  );
};

const SideNavLink = (props: SideNavConfig & {location: Location}) => {
  if (!props?.visible) return null;

  if ('type' in props && 'label' in props && props.type === 'title') {
    return (
      <Typography component="li" sx={styles.title}>
        {props.label}
      </Typography>
    );
  }

  if ('type' in props && props.type === 'divider') return <Divider component="li" sx={styles.divider} />;

  if (!props?.children) {
    const isLinkActive =
      props.link && (props.location.pathname === props.link || isChildOf(props.location.pathname, props.link));
    return (
      <Grid component="li" sx={{paddingRight: 1}}>
        <ListItemButton
          component={props.link ? Link : 'li'}
          to={props.link}
          sx={{
            ...styles.link,
            ...(isLinkActive && styles.linkListActive),
          }}
          disableRipple
        >
          {props.icon && (
            <ListItemIcon sx={{...styles.listItemIcon, ...(isLinkActive && styles.linkItemIconActive)}}>
              {props.icon}
            </ListItemIcon>
          )}
          <ListItemText
            sx={{
              ...(isLinkActive && styles.linkTextActive),
            }}
            disableTypography
            primary={props.label}
          />
        </ListItemButton>
      </Grid>
    );
  }

  return <NestedNavLink {...props} />;
};

export default SideNavLink;
