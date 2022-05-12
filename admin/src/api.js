const authentication = (ui) => {
  return {
    basic ({ username, password }) {
      return ui.http.post('/api/v1/user/login', { username, password })
        .then(body => {
          if (!body) {
            return
          }

          return body.data
          // return {
          //   'data': {
          //     'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiKiJdLCJ1c2VyVHlwZSI6MCwiYXVkIjoiZWRyLWRhc2hib2FyZCIsImV4cCI6MTY1MjQ1MzM0OCwianRpIjoiNjI3ZDFlNjQyNDQxZWUwOTc0MWM4NDFlIiwiaWF0IjoxNjUyMzY2OTQ4LCJpc3MiOiJlZHItZGFzaGJvYXJkIiwic3ViIjoiYWRtaW4ifQ.uaY-hiK1mIx3hYuEhI4-S2AJgbIwLxuNeDmdl_QgCi0'
          //   } }
        })
    }
  }
}

export { authentication }
