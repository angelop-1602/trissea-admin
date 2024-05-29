
export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    passenger: '/dashboard/passenger',
    driver: '/dashboard/driver',
    realtimeDrivers:'/dashboard/realtime-driver',
    driverProfile: `/dashboard/driver-profile?id=`,
    passengerProfile: '/dashboard/passenger-profile?id=',
    driverCompare: '/dashboard/driver-compare?id=',
    toda: '/dashboard/toda'
  },
  components:{
    driverPending: '/dashboard/driver-pending',
    driverReject: '/dashboard/driver-reject',
  },
  errors: { notFound: '/errors/not-found' },

} as const;
