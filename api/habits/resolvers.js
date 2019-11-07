import habits from './habits';

export const habitsResolvers = {
  Query: {
    async habits() {
      console.log('habits');
      return [
        {
          _id: 'somefunkyarray',
          name: 'Make my bed',
        },
      ];
    },
  },
};
