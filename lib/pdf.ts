import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ChannelStats, VideoStats } from '@/types';

export async function generatePDFReport(
  channel: ChannelStats,
  videos: VideoStats[],
  element?: HTMLElement,
): Promise<void> {
  const pdf = new jsPDF();


  pdf.setFontSize(20);
  pdf.text('YouTube Channel Report', 20, 30);


  pdf.setFontSize(14);
  pdf.text(`Channel: ${channel.title}`, 20, 50);
  pdf.setFontSize(12);
  pdf.text(`Subscribers: ${channel.subscriberCount.toLocaleString()}`, 20, 65);
  pdf.text(`Total Views: ${channel.viewCount.toLocaleString()}`, 20, 80);
  pdf.text(`Videos: ${channel.videoCount}`, 20, 95);


  if (videos.length > 0) {
    const avgViews =
      videos.reduce((sum, v) => sum + v.views, 0) / videos.length;
    const avgEngagement =
      videos.reduce((sum, v) => sum + v.engagementRate, 0) / videos.length;
    const totalViews = videos.reduce((sum, v) => sum + v.views, 0);

    pdf.text(
      `Average Views: ${Math.round(avgViews).toLocaleString()}`,
      20,
      110,
    );
    pdf.text(`Average Engagement: ${avgEngagement.toFixed(2)}%`, 20, 125);
    pdf.text(`Total Views (Sample): ${totalViews.toLocaleString()}`, 20, 140);
  }

 
  if (element) {
    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 20, 160, 170, 100);
    } catch (error) {
      console.error('Failed to capture chart for PDF:', error);
    }
  }

  pdf.save(`${channel.title.replace(/[^a-z0-9]/gi, '_')}_report.pdf`);
}
