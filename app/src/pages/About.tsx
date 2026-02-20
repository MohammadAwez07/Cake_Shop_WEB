import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Award, Users, Leaf, 
  Sparkles 
} from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every cake is crafted with passion and care, ensuring each bite brings joy.',
    },
    {
      icon: Leaf,
      title: 'Premium Ingredients',
      description: 'We source only the finest, freshest ingredients from trusted local suppliers.',
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Our creations have been recognized for excellence in taste and design.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond for every order.',
    },
  ];

  const team = [
    {
      name: 'Maria Amma',
      role: 'Founder & Head Baker',
      image: 'https://images.unsplash.com/photo-1583394293214-28ez9e9c8f0e?w=400&h=400&fit=crop',
      quote: 'Baking is not just a craft, it\'s a way to spread happiness.',
    },
    {
      name: 'Antonio Rossi',
      role: 'Executive Pastry Chef',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop',
      quote: 'Every creation is a masterpiece waiting to be discovered.',
    },
    {
      name: 'Sarah Chen',
      role: 'Cake Designer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      quote: 'Design is where art meets flavor in perfect harmony.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1920&q=80"
            alt="Bakery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-imperial-brown/90 to-imperial-brown/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-imperial-gold" />
              <span className="text-white/90 text-sm font-medium">Our Story</span>
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">
              Crafting Sweet<br />
              <span className="text-gradient">Memories Since 1995</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              From a small family kitchen to a beloved bakery, our journey has been 
              filled with flour, sugar, and countless smiles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=800&q=80"
                alt="Our Bakery"
                className="rounded-3xl shadow-luxury"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-imperial-gold/10 text-imperial-gold text-sm font-medium mb-4">
                Our Journey
              </span>
              <h2 className="font-display text-4xl font-bold text-imperial-brown mb-6">
                A Legacy of Excellence
              </h2>
              <div className="space-y-4 text-imperial-brown/70 leading-relaxed">
                <p>
                  AMMAS Pastries began in 1995 when Maria Amma, a passionate home baker, 
                  decided to share her family recipes with the world. What started as a 
                  small kitchen operation quickly grew into a beloved local bakery.
                </p>
                <p>
                  Over the years, we&apos;ve stayed true to our roots while embracing innovation. 
                  Our team of skilled artisans combines traditional techniques with modern 
                  creativity to create cakes that are as beautiful as they are delicious.
                </p>
                <p>
                  Today, AMMAS Pastries is more than just a bakery – it&apos;s a destination 
                  for those seeking exceptional quality and unforgettable flavors. Every 
                  cake that leaves our kitchen carries with it decades of expertise and 
                  a whole lot of love.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-8">
                {[
                  { value: '25+', label: 'Years' },
                  { value: '50K+', label: 'Customers' },
                  { value: '100+', label: 'Recipes' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="font-display text-3xl font-bold text-imperial-gold">{stat.value}</div>
                    <div className="text-sm text-imperial-brown/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-imperial-gold/10 text-imperial-gold text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="font-display text-4xl font-bold text-imperial-brown mb-4">
              What We Stand For
            </h2>
            <p className="text-imperial-brown/60 max-w-2xl mx-auto">
              Our core values guide everything we do, from selecting ingredients to 
              delivering the perfect cake to your doorstep.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-imperial-cream hover:bg-imperial-soft/50 transition-colors group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-semibold text-xl text-imperial-brown mb-3">
                  {value.title}
                </h3>
                <p className="text-imperial-brown/60 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-imperial-gold/10 text-imperial-gold text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="font-display text-4xl font-bold text-imperial-brown mb-4">
              Meet the Artisans
            </h2>
            <p className="text-imperial-brown/60 max-w-2xl mx-auto">
              The talented individuals behind every delicious creation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-luxury overflow-hidden group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-imperial-brown/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm italic">&ldquo;{member.quote}&rdquo;</p>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-display font-semibold text-xl text-imperial-brown mb-1">
                    {member.name}
                  </h3>
                  <p className="text-imperial-gold text-sm">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-imperial-gold/10 text-imperial-gold text-sm font-medium mb-4">
              Our Process
            </span>
            <h2 className="font-display text-4xl font-bold text-imperial-brown mb-4">
              From Kitchen to You
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Selection', desc: 'Premium ingredients sourced daily' },
              { step: '02', title: 'Preparation', desc: 'Meticulous crafting with care' },
              { step: '03', title: 'Baking', desc: 'Perfect temperature and timing' },
              { step: '04', title: 'Delivery', desc: 'Fresh to your doorstep' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold-gradient flex items-center justify-center shadow-soft">
                  <span className="font-display text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-imperial-brown mb-2">
                  {item.title}
                </h3>
                <p className="text-imperial-brown/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
