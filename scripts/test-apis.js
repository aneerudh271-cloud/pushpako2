import dotenv from 'dotenv'
import fetch from 'node-fetch'

// Load environment variables
dotenv.config({ path: '.env.local' })

const BASE_URL = 'http://localhost:3000'

async function testAPI(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const result = await response.json()

    console.log(`${method} ${endpoint}: ${response.status}`)
    if (response.ok) {
      console.log('✓ Success')
    } else {
      console.log('✗ Error:', result.error)
    }

    return { response, result }
  } catch (error) {
    console.log(`${method} ${endpoint}: Connection failed`)
    console.log('✗ Error:', error.message)
    return { response: null, result: null }
  }
}

async function runTests() {
  console.log('Testing API endpoints...\n')

  // Test database connection
  console.log('1. Testing database connection:')
  await testAPI('/api/test-db')

  // Test blogs API
  console.log('\n2. Testing blogs API:')
  const blogsResponse = await testAPI('/api/blogs')
  if (blogsResponse.response?.ok) {
    console.log(`Found ${blogsResponse.result.total || blogsResponse.result.length} blogs`)
  }

  // Test services API
  console.log('\n3. Testing services API:')
  const servicesResponse = await testAPI('/api/services')
  if (servicesResponse.response?.ok) {
    console.log(`Found ${servicesResponse.result.length} services`)
  }

  // Test technologies API
  console.log('\n4. Testing technologies API:')
  const techResponse = await testAPI('/api/technologies')
  if (techResponse.response?.ok) {
    console.log(`Found ${techResponse.result.length} technologies`)
  }

  // Test users API
  console.log('\n5. Testing users API:')
  const usersResponse = await testAPI('/api/users')
  if (usersResponse.response?.ok) {
    console.log(`Found ${usersResponse.result.length} users`)
  }

  // Test investors API
  console.log('\n6. Testing investors API:')
  const investorsResponse = await testAPI('/api/investors')
  if (investorsResponse.response?.ok) {
    console.log(`Found ${investorsResponse.result.length} investors`)
  }

  // Test team API
  console.log('\n7. Testing team API:')
  const teamResponse = await testAPI('/api/team')
  if (teamResponse.response?.ok) {
    console.log(`Found ${teamResponse.result.length} team members`)
  }

  // Test about-us API
  console.log('\n8. Testing about-us API:')
  await testAPI('/api/about-us')

  // Test roadmap API
  console.log('\n9. Testing roadmap API:')
  const roadmapResponse = await testAPI('/api/roadmap')
  if (roadmapResponse.response?.ok) {
    console.log(`Found ${roadmapResponse.result.length} roadmap items`)
  }

  // Test individual blog retrieval
  console.log('\n10. Testing individual blog retrieval:')
  if (blogsResponse.response?.ok && blogsResponse.result.blogs?.length > 0) {
    const firstBlog = blogsResponse.result.blogs[0]
    await testAPI(`/api/blogs/${firstBlog._id}`)
    await testAPI(`/api/blogs/${firstBlog.slug}`)
  }

  console.log('\nAPI testing completed!')
}

runTests().catch(console.error)