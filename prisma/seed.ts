import { PrismaClient, PostType, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
const posts = [
  ['Nvidia agrees to acquire Hugging Face for $13B','https://www.businessinsider.com/nvidia-in-talks-to-buy-hugging-face-13-billion-dollars-2026-8'],
  ['Mechanical Turk shutting down September 30','https://mturk.com'],
  ['GLM-5.3-Flash','https://z.ai/blog/glm-5.3-flash'],
  ['Asahi Linux Progress Report: Linux 7.2','https://asahilinux.org/2026/08/progress-report-7-2/'],
  ['U.S. State Department pauses immigrant visa applications','https://www.wsj.com/politics/policy/u-s-state-department-pauses-immigrant-visa-applications-25b31b23'],
  ['Tailcat – Like netcat, but over Tailscale’s data plane','https://tailscale.com/tailcat'],
];
async function main(){const passwordHash=await bcrypt.hash('password123',12);const user=await prisma.user.upsert({where:{email:'demo@grillme.local'},update:{},create:{email:'demo@grillme.local',username:'demo',name:'Demo User',passwordHash}});await prisma.user.upsert({where:{email:'moderator@grillme.local'},update:{role:Role.MODERATOR},create:{email:'moderator@grillme.local',username:'moderator',name:'Moderator',role:Role.MODERATOR,passwordHash}});const names=['AI','Programming','Open Source','Startups','Security','Hardware','Science','General'];const categories=await Promise.all(names.map(name=>prisma.category.upsert({where:{slug:name.toLowerCase().replaceAll(' ','-')},update:{},create:{name,slug:name.toLowerCase().replaceAll(' ','-')}})));for(let i=0;i<posts.length;i++){const [title,url]=posts[i];await prisma.post.upsert({where:{id:`demo-${i+1}`},update:{},create:{id:`demo-${i+1}`,title,url,type:PostType.LINK,score:[1206,387,1041,295,547,586][i],authorId:user.id,categoryId:categories[i%categories.length].id}})}console.log('Seeded demo data. Login: demo@grillme.local / password123')}main().finally(()=>prisma.$disconnect());
