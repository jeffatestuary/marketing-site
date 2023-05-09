import * as React from "react"
import Layout from "../components/layout"
import { StaticImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import { Slider, useMediaQuery, useTheme } from "@mui/material"

import FlowLogo from "../svgs/flow-logo.svg"
import BlueCheckmark from "../svgs/blue-checkmark.svg"
import PricingOpenSource from "../svgs/pricing-open-source.svg"
import PricingCloud from "../svgs/pricing-cloud.svg"
import PricingEnterprise from "../svgs/pricing-enterprise.svg"
import ComingSoon from "../svgs/coming-soon-icon.svg"
import GraphicQuote from "../svgs/graphic-quote.svg"
import { OutboundLink } from "gatsby-plugin-google-gtag"

function gByteLabel(gb: number, maxPrec = 10) {
    const units = ["GB", "TB"]

    let unitIndex = 0
    let scaledValue = gb

    while (scaledValue >= 1000 && unitIndex < units.length - 1) {
        unitIndex += 1
        scaledValue /= 1000
    }

    return `${scaledValue.toFixed(Math.min(unitIndex, maxPrec))} ${units[unitIndex]}`
}

const ChecklistItem = ({ children }) => (
    <div className="pricing-page-checklist-item">
        <BlueCheckmark className="pricing-page-tile-checkmark-image" />
        <p className="pricing-page-tile-checklist-item-text">{children}</p>
    </div>
)
// $0.75/GB up to 1000 GB / month and then we cut pricing in half after that per GB
const calculatePrice = (gbs: number) => {
    let calc: string | number = Math.min(1000, gbs) * 0.75 + Math.max(0, (gbs - 1001) * 0.375);
    calc = Math.round(calc);
    return (
        <>
            <span className="pricing-page-price-bold">
                $
                {calc}
            </span>
            /month
        </>
    )

}

const PricingPage = () => {
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.between("sm", "lg"))

    const x_factor = isMedium ? 0.0022 : 0.0028

    const sliderScale = x => 1 / (1 + Math.E ** ((x * x_factor) * -1));
    const inverseSliderScale = x => Math.log(x / (1 - x)) / x_factor
    const marks = (isMedium ? [27, 500, 1000, 5000] : [27, 250, 500, 1000, 5000]).map(v => ({
        label: gByteLabel(v, 0),
        value: sliderScale(v),
    }));
    console.log(marks)
    const [selectedGB, setSelectedGB] = React.useState(sliderScale(27))
    return (
        <Layout headerTheme="light">
            <div className="pricing-page">
                <div className="pricing-page-background-image-wrapper">
                    <div className="pricing-page-top">
                        <div className="pricing-page-top-left">
                            <h1 className="product-flow-section-one-h1">
                                Pricing Tiers
                            </h1>
                            <p className="pricing-page-subheader-text">
                                Predictable pricing that scales with your
                                business.
                            </p>
                            <p className="pricing-page-subheader-text">
                                No charge for storing data. Since we don't store
                                your data, storage is in your own cloud storage
                                bucket at low cloud storage rates
                            </p>
                        </div>
                        <div className="pricing-page-top-right">
                            <FlowLogo className="product-flow-section-one-image" />
                        </div>
                    </div>

                    <div className="pricing-page-tiles-wrapper">
                        <div className="pricing-page-tile">
                            <PricingOpenSource className="pricing-page-tile-icon icon-wrapper" />
                            <p className="pricing-page-tile-name">
                                Free
                            </p>
                            <p className="pricing-page-tile-price-subtext">Free for up to two tasks and 10 GB/Mo.  No credit card required.</p>
                            <p className="pricing-page-price">
                                <span className="pricing-page-price-bold">
                                    $0
                                </span>
                                /month
                            </p>
                            <div className="pricing-page-checklist-wrapper">
                                <ChecklistItem>
                                    Millisecond latency
                                </ChecklistItem>
                                <ChecklistItem>
                                    Real-time capture transformation & data syncing
                                </ChecklistItem>
                                <ChecklistItem>
                                    UI for connecting, testing and monitoring
                                </ChecklistItem>

                                <ChecklistItem>
                                    Incremental transfers, resulting in a much lower cost than traditional CDC products
                                </ChecklistItem>

                                <ChecklistItem>
                                    Create and access entities via a CLI
                                </ChecklistItem>

                                <ChecklistItem>
                                    Use up to 50 collections, 2 total tasks (Captures, Materializations and/or transformations)
                                </ChecklistItem>
                            </div>
                            <Link
                                className="pricing-page-tile-button"
                                to="https://github.com/estuary/flow"
                            >
                                Get started
                            </Link>
                        </div>
                        <div className="pricing-page-tile">
                            <PricingCloud className="pricing-page-tile-icon icon-wrapper" />
                            <p className="pricing-page-tile-name">Cloud</p>
                            <p className="pricing-page-tile-price-subtext">Up to 27GB/month for $20 then $0.75/GB.</p>
                            <p className="pricing-page-price">
                                {calculatePrice(inverseSliderScale(selectedGB))}
                            </p>
                            <Slider
                                value={selectedGB}
                                onChange={(_, val) =>
                                    setSelectedGB(sliderScale(Math.round(inverseSliderScale(val || val[0]))))
                                }
                                min={marks[0].value}
                                max={marks[marks.length-1].value}
                                step={marks[0].value / 1000}
                                marks={marks}
                                style={{ margin: `0 0 3rem 0` }}
                            />

                            <div className="pricing-page-checklist-wrapper">
                                {/* <ChecklistItem>
                                    <span className="pricing-page-checklist-item-text-bold">
                                        {gByteLabel(inverseSliderScale(selectedGB))}
                                    </span>{" "}
                                    average monthly changes
                                </ChecklistItem> */}
                                <p>Everything in Flow Free plus:</p>
                                <ChecklistItem>99.9% SLA</ChecklistItem>
                                <ChecklistItem>Limitless horizontal scaling</ChecklistItem>
                                <ChecklistItem>Unlimited collections, captures and materializations</ChecklistItem>
                                <ChecklistItem>Pay as you go, monthly and annual payment options</ChecklistItem>
                                <ChecklistItem>Free 30-day trial</ChecklistItem>
                                <ChecklistItem>9x5 Customer Support - Slack + email</ChecklistItem>
                            </div>
                            <p className="pricing-page-tile-price-subtext">
                                Your usage will vary depending on your use case. Our users typically save 70-80% over other solutions, with no loss of functionality.
                            </p>
                            <OutboundLink
                                target="_blank"
                                href="https://dashboard.estuary.dev/register"
                                className="pricing-page-tile-button"
                            >
                                Try it free
                            </OutboundLink>
                        </div>
                        <div className="pricing-page-tile">
                            <PricingEnterprise className="pricing-page-tile-icon icon-wrapper" />
                            <p className="pricing-page-tile-name">Enterprise</p>
                            <p className="pricing-page-tile-price-subtext">For large or custom deployments of Flow.</p>
                            <p className="pricing-page-price">
                                <span className="pricing-page-price-bold">
                                    Custom
                                </span>
                            </p>
                            <div className="pricing-page-checklist-wrapper-custom">
                                <ChecklistItem>
                                    Advanced SSO (OAuth / SAML / SCIM)
                                </ChecklistItem>
                                <div className="pricing-page-checklist-item">
                                    <ComingSoon className="pricing-page-tile-coming-soon-image" />
                                    <p className="pricing-page-tile-checklist-item-text">
                                        Custom VPC deployment
                                    </p>
                                </div>
                                <ChecklistItem>
                                    Certificates of SOC2 & HIPAA compliance
                                </ChecklistItem>
                                <ChecklistItem>
                                    Provisioned servers
                                </ChecklistItem>
                                <ChecklistItem>
                                    9x5 Support standard, 24x7 support available, Customer Success Manager.
                                </ChecklistItem>
                            </div>
                            <p className="pricing-page-tile-price-subtext">
                                Want to try Flow for free for 30 days, with no limit on data transfer?
                            </p>
                            <Link
                                className="pricing-page-tile-button"
                                to="/about#contact-us"
                            >
                                Contact us
                            </Link>
                        </div>
                    </div>
                    <div className="pricing-page-faq">
                        <h2 className="pricing-page-faq-title">Frequently Asked Questions</h2>
                        <div className="pricing-page-faq-qa-wrapper">
                            <p className="pricing-page-faq-question">How is my monthly bill calculated?</p>
                            <p className="pricing-page-faq-answer">Your bill is calculated based on the amount of data that is Captured, Transformed and Materialized by Flow to your destinations.  Each of these are “tasks” and activity from all tasks are summed on a monthly basis.  Unlike other platforms, Flow doesn’t store data and you’ll only pay on data that is actively moved during that month.  In the free tier, you are given 10 GB of streaming data at no charge, at which point the product will stop capturing and materializing additional data.</p>
                        </div>
                        <div className="pricing-page-faq-qa-wrapper">
                            <p className="pricing-page-faq-question">How can I get Flow discounts?</p>
                            <p className="pricing-page-faq-answer">Discounts are based on two things - volume commitments and contract duration. Please contact us to learn more about the discounts available for your use case.</p>
                        </div>
                        <div className="pricing-page-faq-qa-wrapper">
                            <p className="pricing-page-faq-question">How does Pay as you Go (PAYG) pricing work?</p>
                            <p className="pricing-page-faq-answer">For customers that are just starting out, or don’t want to commit to a specific volume of data or time commitment, you can simply use Flow and pay for actual consumption on a monthly basis. You enter your credit card information and at the end of each month, your bill is computed based on the amount of data transfer.</p>
                        </div>
                        <div className="pricing-page-faq-qa-wrapper">
                            <p className="pricing-page-faq-question">How does prepay work?</p>
                            <p className="pricing-page-faq-answer">Customers that want to pay for a fixed amount of data transfer can pay up front and then burn down that usage over time (no more than 12 months). The more data transfer that is paid for up front, the larger the discount from the PAYG price.</p>
                        </div>
                        <div className="pricing-page-faq-qa-wrapper">
                            <p className="pricing-page-faq-question">How long can I trial Flow?</p>
                            <p className="pricing-page-faq-answer">Flow can be used for free indefinitely, with the only gate that you are limited to 10 GB of data transfer each month. For customers with larger needs, we do offer a 30 day free trial upon request. Please contact us to learn more and to qualify.</p>
                        </div>
                        <div className="pricing-page-faq-qa-wrapper">
                            <p className="pricing-page-faq-question">What if I need more time than 30 days to trial Flow?</p>
                            <p className="pricing-page-faq-answer">Your bill is calculated based on the amount of data that is Captured, Transformed and Materialized by Flow to your destinations.  Each of these are “tasks” and activity from all tasks are summed on a monthly basis.  Unlike other platforms, Flow doesn’t store data and you’ll only pay on data that is actively moved during that month.  In the free tier, you are given 10 GB of streaming data at no charge, at which point the product will stop capturing and materializing additional data.</p>
                        </div>
                        <div className="pricing-page-faq-qa-wrapper">
                            <p className="pricing-page-faq-question">What are my billing options?</p>
                            <p className="pricing-page-faq-answer">The Free tier does not require a credit card or any billing information. The Standard tier can be paid via credit card, debit card (for prepay), or Invoice. The Enterprise tier is paid for via Invoice.
                            </p>
                        </div>
                        <div className="pricing-page-faq-qa-wrapper">
                            <p className="pricing-page-faq-question">How do you keep the costs down with very large data sets?</p>
                            <p className="pricing-page-faq-answer">If your dataset is very large, we are happy to create a custom pricing to meet all of your needs.</p>
                        </div>
                    </div>
                    <div className="pricing-page-quote-box">
                        <GraphicQuote className="pricing-page-tile-graphic-quote-image" />
                        <p className="pricing-page-quote-box-quote">
                            “This tool is 1000x times better than LogStash or
                            Elastic Enterprise Data Ingestion Tool, which has
                            many issues.”
                        </p>
                        <div className="pricing-page-quote-image-wrapper">
                            <StaticImage
                                placeholder="none"
                                alt="data flow image"
                                src="../images/pompato-color.svg"
                                layout="fixed"
                                className="pricing-page-tile-coming-soon-image"
                            />
                            <p className="pricing-page-quote-source-name">
                                Pompato
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PricingPage
