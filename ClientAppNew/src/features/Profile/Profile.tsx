import React, { useEffect, useState } from 'react';
import { Grid, InputLabel, Avatar, Tooltip, styled, TooltipProps, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from 'selectors/auth.selector';
import { useEmpStyles } from 'features/Employee/emp.styles';
import empService from 'services/emp.Request';
import Swal from 'sweetalert2';
import { setUserData } from 'actions/auth.action';
import authService from 'services/authService';
import profile from '../../assets/images/Profile.png';

export default function Profile() {
  const user = useSelector(userSelector);

  const joiningDate = new Date(user?.joiningDate);
  const userJoiningDate = `${joiningDate.getDate()}-${joiningDate.getMonth() + 1}-${joiningDate.getFullYear()}`;

  const userProfile = user?.profilePicture !== 'string' ? `data:image/png;base64,${user?.profilePicture}` : profile;

  const classes = useEmpStyles();
  const dispatch = useDispatch();
  const [images, setImages] = useState<any>([]);
  // const [userProfileImage, setUserProfileImage] = useState<any>([]);

  // useEffect(() => {
  //   empService.updateProfilePicture(user.employeeId, user.profilePicture);
  //   const userProfile = user?.profilePicture !== 'string' ? `data:image/png;base64,${user?.profilePicture}` : profile;
  //   setUserProfileImage(userProfile);
  // }, [user]);

  const handleImageChange = (e: any) => {
    console.log(localStorage.getItem('user'));
    console.log('TOP:::::::+++++');

    const fileList = Array.from(e.target.files);
    fileList.forEach((file: any, i) => {
      const reader = new FileReader();

      reader.onloadend = async () => {
        setImages([reader.result]);

        const idCardBase64: any = await getBase64(file, '');
        user.profilePicture = idCardBase64;
        const response = await empService.updateProfilePicture(user.employeeId, user.profilePicture);
        dispatch(empService.fetchEmpList());
        if (response.status === 400) {
          Swal.fire({
            customClass: 'alertBottomRight',
            position: 'center',
            icon: 'error',
            title: response.data.message,
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          Swal.fire({
            customClass: 'alertBottomRight',
            position: 'center',
            icon: 'success',
            title: 'Profile picture updated successfully!',
            showConfirmButton: false,
            timer: 2000,
          });
        }
        authService.setSession('user', JSON.stringify(response.data.user));
      };

      reader.readAsDataURL(file);
    });
  };

  async function getBase64(file: any, cb: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          const base64String = reader.result as string;
          base64String.split(',')[1].trim();
          setImages(base64String);
          resolve(base64String.split(',')[1].trim());
        };

        reader.onerror = function (error) {};
      }, 500);
    });
  }

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({}),
  );

  return (
    <div>
      <div>
        <Grid container spacing={2} style={{ width: '100px', height: '100px', marginBottom: 2, marginTop: 1 }}>
          <Button component="label" className={classes.uploadBtn}>
            <input
              id="file"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(event) => {
                handleImageChange(event);
              }}
            />
            {images && images.length > 0 ? (
              <div>
                <Avatar
                  style={{
                    width: '100px',
                    height: '100px',
                  }}
                >
                  <img alt="" height="100%" width="100%" src={images} />
                </Avatar>
              </div>
            ) : (
              setImages(userProfile)
            )}
          </Button>
        </Grid>
        <Grid container>
          <Grid container xs={12} style={{ marginTop: 60 }}>
            <Grid xs={3} style={{ marginLeft: '20px', marginRight: 15, marginBottom: 15 }}>
              <InputLabel>
                <b>Employee Number</b>
              </InputLabel>
              <InputLabel>{user?.employeeNumber}</InputLabel>
            </Grid>
            <Grid xs={3} style={{ marginRight: 10 }}>
              <InputLabel>
                <b>Name</b>
              </InputLabel>
              <InputLabel>{user?.firstName}</InputLabel>
            </Grid>
            <Grid xs={3} style={{ marginRight: 10 }}>
              <InputLabel>
                <b>Surname</b>
              </InputLabel>
              <InputLabel>{user?.lastName}</InputLabel>
            </Grid>
            <Grid xs={3} style={{ marginLeft: '20px', marginRight: 15, marginBottom: 15, marginTop: 40 }}>
              <InputLabel>
                <b>Email Address</b>
              </InputLabel>
              <LightTooltip
                title={<div style={{ backgroundColor: 'white', color: '#666665' }}>{user?.email}</div>}
                placement="top"
              >
                <InputLabel style={{ width: '280px' }}>{user?.email}</InputLabel>
              </LightTooltip>
            </Grid>
            <Grid xs={3} style={{ marginRight: 10, marginTop: 40 }}>
              <InputLabel>
                <b>Mobile Number</b>
              </InputLabel>
              <InputLabel>{user?.mobileNo}</InputLabel>
            </Grid>
            <Grid xs={3} style={{ marginRight: 10, marginTop: 40 }}>
              <InputLabel>
                <b>Address</b>
              </InputLabel>
              <LightTooltip
                style={{ backgroundColor: 'white' }}
                title={<div style={{ backgroundColor: 'white', color: '#666665' }}>{user?.address}</div>}
                placement="top"
              >
                <InputLabel style={{ width: '280px' }}>{user?.address}</InputLabel>
              </LightTooltip>
            </Grid>
            <Grid xs={3} style={{ marginLeft: '20px', marginRight: 15, marginTop: 40 }}>
              <InputLabel>
                <b>Department</b>
              </InputLabel>
              <InputLabel>{user?.department.departmentName}</InputLabel>
            </Grid>
            <Grid xs={3} style={{ marginRight: 10, marginTop: 40 }}>
              <InputLabel>
                <b>Role</b>
              </InputLabel>
              <InputLabel>{user?.role}</InputLabel>
            </Grid>
            <Grid xs={3} style={{ marginRight: 10, marginTop: 40 }}>
              <InputLabel>
                <b>Joining Date</b>
              </InputLabel>
              <InputLabel>{userJoiningDate}</InputLabel>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
