// Script to update user to admin role
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        email: 'nextgenrdp@gmail.com',
      },
      data: {
        isAdmin: true,
      },
    });
    
    console.log('User updated successfully:');
    console.log(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 