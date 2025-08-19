
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, BarChartBig, Scale, FileText, Link as LinkIcon, Users, Building, PenTool, ShieldCheck, List, BarChartHorizontal } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="text-center p-6">
    <div className="mb-4 inline-block bg-primary/10 text-primary p-3 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </Card>
);

const CoreFeature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <li className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">{icon}</div>
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </li>
);

const WhoWeServeCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <Card className="text-center p-8">
        <div className="mb-4 inline-block bg-primary/10 text-primary p-4 rounded-full">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
    </Card>
);


export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-4">About NewsLens</h1>
          <p className="text-xl text-muted-foreground mb-8">Empowering Smarter News Consumption</p>
          <div className="max-w-3xl mx-auto bg-primary/5 border border-primary/20 p-8 rounded-lg">
            <p className="text-lg text-foreground/80">
              NewsLens is an AI-powered platform designed to help individuals, organizations, and media professionals evaluate the trustworthiness of news content. In today's fast-moving information landscape, misinformation and bias can spread quickly. Our mission is to provide users with the clarity and context they need to make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 md:py-20 bg-secondary/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-headline mb-4">What We Do</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our comprehensive suite of AI-powered tools helps you navigate the complex world of news and information
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<ShieldCheck />} title="Credibility Analysis" description="Our AI evaluates articles across multiple dimensions, offering clear and transparent credibility ratings." />
            <FeatureCard icon={<Scale />} title="Bias Detection" description="We identify potential political, cultural, or ideological bias in reporting." />
            <FeatureCard icon={<FileText />} title="AI Summaries" description="Complex stories are distilled into concise summaries with key findings and alternative perspectives." />
            <FeatureCard icon={<BarChartBig />} title="Visual Insights" description="Intuitive dashboards and charts make it easy to track trends, spot patterns, and compare sources." />
          </div>
        </div>
      </section>
      
      {/* Core Features Section */}
       <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-card p-8 rounded-lg shadow-md">
                     <h2 className="text-4xl font-bold font-headline mb-8 text-center">Core Features</h2>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <CoreFeature icon={<LinkIcon size={20} />} title="URL Input" description="Allow users to input news articles via URL for instant analysis." />
                        <CoreFeature icon={<FileText size={20} />} title="Text Input" description="Allow users to input news articles via direct text paste." />
                        <CoreFeature icon={<CheckCircle size={20} />} title="Credibility Analysis" description="Analyze news articles for credibility using advanced AI models." />
                        <CoreFeature icon={<Scale size={20} />} title="Bias Detection" description="Detect potential bias in articles using AI-powered tools." />
                        <CoreFeature icon={<List size={20} />} title="Key Findings Summary" description="Summarize key findings with AI-powered summarization tools." />
                        <CoreFeature icon={<BarChartHorizontal size={20} />} title="Rating Visualization" description="Display ratings and reliability in easy-to-understand formats." />
                    </ul>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-12 rounded-lg text-center">
                    <h2 className="text-4xl font-bold font-headline mb-4">Why It Matters</h2>
                    <p className="text-lg text-foreground/80 leading-relaxed">
                        Healthy democracies and informed communities depend on access to accurate, balanced information. NewsLens helps strengthen media literacy by making credibility assessments accessible to everyone.
                        <br/><br/>
                        By combining advanced AI with transparent methodology, we aim to build trust in journalism and promote exposure to diverse viewpoints.
                    </p>
                </div>
            </div>
        </div>
      </section>


      {/* Who We Serve Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-headline mb-4">Who We Serve</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our platform is designed to serve diverse audiences with varying needs in media analysis
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <WhoWeServeCard icon={<Users />} title="Individuals" description="Gain confidence in your daily news reading and make informed decisions about the information you consume." />
            <WhoWeServeCard icon={<Building />} title="Organizations" description="Monitor information ecosystems, track credibility trends, and train teams in media literacy." />
            <WhoWeServeCard icon={<PenTool />} title="Media Professionals" description="Benchmark reporting, identify bias, and foster accountability in journalism." />
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold font-headline mb-4">Our Vision</h2>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto">
            We envision a world where people can navigate information with confidence, challenge their own echo chambers, and engage in constructive dialogue rooted in facts.
          </p>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-20 text-primary-foreground" style={{background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)'}}>
          <div className="container mx-auto text-center px-4">
              <h2 className="text-4xl font-bold font-headline mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of users who trust NewsLens for reliable news analysis
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Start Analyzing
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    View Dashboard
                </Button>
              </div>
          </div>
      </section>

    </div>
  );
}
