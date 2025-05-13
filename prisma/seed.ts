import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding the database...')

  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@nextgenrdp.com' },
    update: {},
    create: {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@nextgenrdp.com',
      password: adminPassword,
      role: 'ADMIN',
      permissions: ['ALL'],
    },
  })
  console.log('Admin created:', admin.id)

  // Create test users
  const userPassword = await hash('password123', 10)
  const users = []
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        name: `Test User ${i}`,
        email: `user${i}@example.com`,
        password: userPassword,
        role: 'USER',
      },
    })
    users.push(user)
    console.log(`User created: ${user.id}`)
  }

  // Create orders
  const planTypes = ['Basic RDP', 'Standard RDP', 'Premium RDP', 'Enterprise RDP', 'Custom Solution']
  const locations = ['US', 'EU', 'Asia', 'Australia']
  const statuses = ['PENDING', 'ACTIVE', 'CANCELLED', 'COMPLETED']
  const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cryptocurrency']

  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const planType = planTypes[Math.floor(Math.random() * planTypes.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    const amount = Math.floor(Math.random() * 20000) + 5000 // 5000-25000 PKR
    
    const order = await prisma.order.create({
      data: {
        orderId: `ORD-${Date.now()}-${i}`,
        userId: user.id,
        planId: `plan-${i + 1}`,
        planName: planType,
        quantity: Math.floor(Math.random() * 3) + 1,
        duration: [30, 90, 180, 365][Math.floor(Math.random() * 4)],
        location,
        locationCode: location.substring(0, 2),
        paymentMethod,
        status,
        totalAmount: amount,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date in the last 30 days
      },
    })
    console.log(`Order created: ${order.id}`)
  }

  // Create user activity data
  for (let hour = 0; hour < 24; hour++) {
    // Higher activity during business hours
    let activityPercentage = 0
    if (hour >= 9 && hour <= 17) {
      activityPercentage = Math.floor(Math.random() * 30) + 60 // 60-90%
    } else if ((hour >= 6 && hour < 9) || (hour > 17 && hour <= 21)) {
      activityPercentage = Math.floor(Math.random() * 30) + 30 // 30-60%
    } else {
      activityPercentage = Math.floor(Math.random() * 25) + 5 // 5-30%
    }

    await prisma.userActivity.upsert({
      where: { hour },
      update: { activityPercentage },
      create: {
        hour,
        activityPercentage,
        updatedAt: new Date(),
      },
    })
  }
  console.log('User activity data created')

  // Create traffic sources
  const sources = [
    { source: 'Direct', count: 1805 },
    { source: 'Organic Search', count: 1204 },
    { source: 'Referral', count: 688 },
    { source: 'Social', count: 602 },
  ]

  for (const source of sources) {
    await prisma.trafficSource.upsert({
      where: { source: source.source },
      update: { count: source.count },
      create: {
        source: source.source,
        count: source.count,
        updatedAt: new Date(),
      },
    })
  }
  console.log('Traffic sources created')

  // Create visitor data
  const now = new Date()
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
  const devices = ['Desktop', 'Mobile', 'Tablet']
  const countries = ['United States', 'United Kingdom', 'Pakistan', 'India', 'Germany', 'Australia']
  
  // Create 30 days of visitor data
  for (let day = 0; day < 30; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() - day)
    
    // More visitors on weekdays
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const visitorsCount = isWeekend 
      ? Math.floor(Math.random() * 100) + 200 
      : Math.floor(Math.random() * 200) + 300

    for (let i = 0; i < visitorsCount; i++) {
      const user = Math.random() > 0.7 ? users[Math.floor(Math.random() * users.length)] : null
      
      await prisma.visitor.create({
        data: {
          userId: user?.id,
          sessionId: `sess_${Date.now()}_${i}`,
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: `Mozilla/5.0 Test Browser`,
          country: countries[Math.floor(Math.random() * countries.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          landingPage: ['/', '/pricing', '/features', '/contact', '/about'][Math.floor(Math.random() * 5)],
          visitDate: date,
        },
      })
    }
    
    // Create page views (multiple per visitor)
    const pageViewsCount = visitorsCount * (Math.floor(Math.random() * 3) + 2) // 2-4 pages per visitor
    for (let i = 0; i < pageViewsCount; i++) {
      await prisma.pageView.create({
        data: {
          page: ['Home', 'Pricing', 'Features', 'Contact', 'About', 'Dashboard', 'RDP', 'VPS'][Math.floor(Math.random() * 8)],
          url: ['/', '/pricing', '/features', '/contact', '/about', '/dashboard', '/rdp', '/vps'][Math.floor(Math.random() * 8)],
          timestamp: date,
        },
      })
    }
    
    console.log(`Created visitor and page view data for day ${day}`)
  }

  // Create conversion data
  for (let day = 0; day < 30; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() - day)
    
    // Better conversion rates on weekdays
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const conversionRate = isWeekend ? 3 + Math.random() * 2 : 4 + Math.random() * 3 // 3-5% weekends, 4-7% weekdays
    
    const attempts = Math.floor(Math.random() * 100) + 400 // 400-500 per day
    const conversions = Math.floor(attempts * (conversionRate / 100))
    
    await prisma.conversion.create({
      data: {
        date,
        attempts,
        conversions,
      },
    })
  }
  console.log('Conversion data created')

  // Create page conversion rates
  const pages = [
    { page: 'Landing Page', rate: 8.2 },
    { page: 'Pricing Page', rate: 5.7 },
    { page: 'Checkout', rate: 92.3 },
    { page: 'Overall Funnel', rate: 4.8 },
  ]

  for (const page of pages) {
    await prisma.pageConversion.upsert({
      where: { pageName: page.page },
      update: { conversionRate: page.rate },
      create: {
        pageName: page.page,
        conversionRate: page.rate,
        attempts: Math.floor(Math.random() * 1000) + 500,
        conversions: Math.floor(Math.random() * 100) + 50,
        updatedAt: new Date(),
      },
    })
  }
  console.log('Page conversion rates created')

  // Create reports
  const reportTypes = ['financial', 'analytics', 'operational', 'customer', 'technical']
  const reportMeta = {
    financial: {
      title: "Monthly Revenue Report",
      description: "Detailed breakdown of revenue streams and sources"
    },
    analytics: {
      title: "User Acquisition Report",
      description: "Analysis of new user registration and sources" 
    },
    operational: {
      title: "Service Utilization Report",
      description: "Overview of services usage and performance metrics"
    },
    customer: {
      title: "Customer Satisfaction Analysis",
      description: "Survey results and satisfaction metrics analysis"
    },
    technical: {
      title: "System Performance Audit",
      description: "Technical performance and infrastructure analysis"
    },
  }

  for (let i = 0; i < 5; i++) {
    const type = reportTypes[i]
    const reportDate = new Date()
    reportDate.setDate(reportDate.getDate() - (i * 4 + 2)) // Spread out over last 20 days
    
    await prisma.report.create({
      data: {
        id: `rep-00${i + 1}`,
        title: reportMeta[type].title,
        description: reportMeta[type].description,
        type,
        status: 'available',
        chartCount: Math.floor(Math.random() * 6) + 1,
        fileSize: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
        createdAt: reportDate,
        updatedAt: reportDate,
        downloadCount: Math.floor(Math.random() * 5),
      },
    })
  }
  console.log('Reports created')

  // Create system status
  await prisma.systemStatus.create({
    data: {
      status: 'Healthy',
      cpuUsage: 24.5,
      memoryUsage: 42.3,
      diskUsage: 38.9,
      networkUsage: 12.3,
      updatedAt: new Date(),
    },
  })
  console.log('System status created')

  // Create notifications
  const notificationTypes = ['security', 'system', 'user', 'transaction', 'support']
  const notificationPriorities = ['high', 'medium', 'low']
  const notificationTitles = {
    security: ['Critical Security Alert', 'Security Vulnerability Detected', 'Login Attempt Failed'],
    system: ['System Update Available', 'Server Disk Space Low', 'Backup Completed'],
    user: ['New User Registration', 'User Profile Updated', 'Password Reset Requested'],
    transaction: ['Payment Processing Error', 'New Order Placed', 'Refund Processed'],
    support: ['New Support Ticket', 'Ticket Updated', 'Support Response Required'],
  }
  const notificationSources = {
    security: 'Security System',
    system: 'System Monitor',
    user: 'User Management',
    transaction: 'Payment Processor',
    support: 'Support System',
  }

  for (let i = 0; i < 7; i++) {
    const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
    const priority = notificationPriorities[Math.floor(Math.random() * notificationPriorities.length)]
    const title = notificationTitles[type][Math.floor(Math.random() * notificationTitles[type].length)]
    const read = i > 1 // First two notifications are unread
    
    let message = ''
    switch (type) {
      case 'security':
        message = 'Multiple failed login attempts detected from unusual location (IP: 45.227.255.206)'
        break
      case 'system':
        message = 'New system update v3.5.2 is available for installation. Contains security patches.'
        break
      case 'user':
        message = `User ${users[Math.floor(Math.random() * users.length)].name} has completed registration`
        break
      case 'transaction':
        message = 'Transaction #8294 failed due to payment gateway error. Customer was notified.'
        break
      case 'support':
        message = 'Support ticket #4582 requires immediate attention. Customer reported service downtime.'
        break
    }
    
    const createdAt = new Date()
    createdAt.setMinutes(createdAt.getMinutes() - (i * 240 + Math.floor(Math.random() * 60))) // Spread over minutes/hours
    
    await prisma.notification.create({
      data: {
        id: `notif-00${i + 1}`,
        title,
        message,
        type,
        priority,
        read,
        source: notificationSources[type],
        adminId: admin.id,
        createdAt,
        updatedAt: createdAt,
      },
    })
  }
  console.log('Notifications created')

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 