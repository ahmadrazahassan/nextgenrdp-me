import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authUtils';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Fetch reports from database
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        type: true,
        status: true,
        chartCount: true,
        fileSize: true
      }
    });
    
    // Format the reports for the frontend
    const formattedReports = reports.map(report => {
      return {
        id: report.id,
        title: report.title,
        description: report.description,
        date: new Date(report.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        type: report.type,
        status: report.status,
        charts: report.chartCount,
        fileSize: report.fileSize
      };
    });
    
    return NextResponse.json(formattedReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    
    // Return empty array instead of error to prevent frontend issues
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    if (!await verifyAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized or forbidden' },
        { status: 403 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { type } = body;
    
    if (!type) {
      return NextResponse.json(
        { error: 'Report type is required' },
        { status: 400 }
      );
    }
    
    // Generate a unique ID for the new report if needed
    const reportId = `rep-${uuidv4()}`;
    
    // Map report types to titles and descriptions
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
      comprehensive: {
        title: "Comprehensive System Report",
        description: "Complete analysis of all system metrics and operations"
      }
    };
    
    // Default values if type is not recognized
    const title = reportMeta[type]?.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Report`;
    const description = reportMeta[type]?.description || `Detailed ${type} analysis and metrics`;
    
    // Save the new report to the database
    const newReport = await prisma.report.create({
      data: {
        id: reportId,
        title,
        description,
        type,
        status: 'generating',
        chartCount: Math.floor(Math.random() * 6) + 1, // This would be determined by the actual report generator
        fileSize: '0 KB', // This would be updated after generation
        createdAt: new Date()
      }
    });
    
    // Schedule a background job to actually generate the report
    // This would typically be handled by a separate process/worker
    
    // For demo purposes, we'll update the report after a delay 
    // to simulate the generation process
    setTimeout(async () => {
      try {
        await prisma.report.update({
          where: { id: reportId },
          data: {
            status: 'available',
            fileSize: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
            updatedAt: new Date()
          }
        });
      } catch (error) {
        console.error('Error updating report status:', error);
      }
    }, 5000);
    
    return NextResponse.json({
      id: newReport.id,
      status: newReport.status,
      type: newReport.type,
      message: `${type} report generation started`
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
} 